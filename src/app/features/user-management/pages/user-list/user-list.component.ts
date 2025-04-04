/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnInit,
  inject,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  TableModel,
  TableHeaderItem,
  TableItem,
  TableModule,
  ButtonModule,
  TableRowSize,
  CheckboxModule,
  IconModule,
  DialogModule,
  InputModule,
  PaginationModule,
} from 'carbon-components-angular';
import { IconService } from '@app/core/services/icon.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as UserSelectors from '../../store/user.selectors';
import { UserActions } from '../../store/user.actions';
import { UserFilter, UserResponse } from '../../models/user.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import {
  TranslocoModule,
  TranslocoService,
  provideTranslocoScope,
} from '@jsverse/transloco';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { FormatApprovalStatusPipe } from '@app/shared/pipes/format-approval-status.pipe';
import { NumberFormatService } from '@app/shared/services/number-format.service';

//@ts-expect-error Fixme: No types for carbon icons
import Add16 from '@carbon/icons/es/add/16';
//@ts-expect-error Fixme: No types for carbon icons
import Settings16 from '@carbon/icons/es/settings/16';
//@ts-expect-error Fixme: No types for carbon icons
import Search16 from '@carbon/icons/es/search/16';
//@ts-expect-error Fixme: No types for carbon icons
import Edit16 from '@carbon/icons/es/edit/16';
//@ts-expect-error Fixme: No types for carbon icons
import TrashCan16 from '@carbon/icons/es/trash-can/16';
//@ts-expect-error Fixme: No types for carbon icons
import Checkmark16 from '@carbon/icons/es/checkmark/16';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    CheckboxModule,
    IconModule,
    DialogModule,
    InputModule,
    PaginationModule,
    CommonModule,
    TranslocoModule,
    FormatApprovalStatusPipe,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
      alias: 'user',
    }),
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private dialog = inject(MatDialog);
  private transloco = inject(TranslocoService);
  private numberFormat = inject(NumberFormatService);

  // Stream control
  private destroy$ = new Subject<void>();
  private templatesReady$ = new BehaviorSubject<boolean>(false);
  private currentUsers: UserResponse[] = [];

  // Reference the templates from the HTML
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;

  // Table model
  model = new TableModel();
  size: TableRowSize = 'md';
  skeleton = true;

  // Store selectors
  users$ = this.store.select(UserSelectors.selectUsers);
  loading$ = this.store.select(UserSelectors.selectUserLoading);
  pagination$ = this.store.select(UserSelectors.selectPagination);
  currentFilter$ = this.store.select(UserSelectors.selectCurrentFilter);
  totalUsers$ = this.store.select(UserSelectors.selectTotalUsers);
  hasError$ = this.store
    .select(UserSelectors.selectUserErrors)
    .pipe(map((errors) => errors !== null));

  // Current state
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  showOnlyPending = false;

  constructor(
    protected iconService: IconService,
    private activatedRoute: ActivatedRoute
  ) {
    this.iconService.registerAll([
      Settings16,
      Add16,
      Search16,
      Edit16,
      TrashCan16,
      Checkmark16,
    ]);

    // Initialize with empty headers - we'll populate them after translations are ready
    this.model.header = [];
    this.model.pageLength = 10;
    this.model.totalDataLength = 0;
  }

  ngOnInit() {
    // Wait for translations to be ready
    this.transloco
      .selectTranslateObject('user.list.columns')
      .pipe(takeUntil(this.destroy$))
      .subscribe((columns) => {
        // Initialize table headers with translations
        this.initializeTable(columns);
      });

    // Initialize loading state
    this.skeleton = true;

    // Subscribe to loading state first to properly handle UI state
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.skeleton = loading;

      // If loading is complete and we have templates and users, update the table
      if (
        !loading &&
        this.templatesReady$.getValue() &&
        this.currentUsers.length > 0
      ) {
        this.updateTableData(this.currentUsers);
      }

      // Force change detection
      this.cdr.detectChanges();
    });

    // Read query parameters from URL to sync state
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const initialFilter: UserFilter = {
          page: params['page'] ? parseInt(params['page']) : 1,
          size: params['size'] ? parseInt(params['size']) : 10,
          sortBy: params['sortBy'] || 'createdAt',
          sortDirection: (params['sortDirection'] as 'ASC' | 'DESC') || 'DESC',
          searchTerm: params['searchTerm'] || '',
          isApproved: params['isApproved'] === 'false' ? false : undefined,
        };

        this.searchTerm = initialFilter.searchTerm || '';
        this.showOnlyPending = initialFilter.isApproved === false;

        // Dispatch initial filter
        this.store.dispatch(UserActions.loadUsers({ filter: initialFilter }));
      });

    // Subscribe to current filter changes
    this.currentFilter$.pipe(takeUntil(this.destroy$)).subscribe((filter) => {
      this.currentPage = filter.page || 1;
      this.pageSize = filter.size || 10;
      this.searchTerm = filter.searchTerm || '';
      this.showOnlyPending = filter.isApproved === false;

      // Update URL query params
      this.updateQueryParams(filter);
    });

    // Subscribe to pagination changes
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      if (pagination) {
        this.model.pageLength = pagination.pageSize;
        this.model.totalDataLength = pagination.totalElements;
        this.model.currentPage = pagination.currentPage;

        // Force change detection to update the UI
        this.cdr.detectChanges();
      }
    });

    // Track user data updates
    this.users$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((users) => {
        this.currentUsers = users || [];

        // Only update the table if templates are ready
        if (this.templatesReady$.getValue() && this.currentUsers.length > 0) {
          // Use ngZone to ensure Angular detects the changes
          this.ngZone.run(() => {
            this.updateTableData(this.currentUsers);
            this.skeleton = false;
            this.cdr.detectChanges();
          });
        }
      });
  }

  ngAfterViewInit() {
    // Check for templates after view initialization
    if (this.statusTemplate && this.actionTemplate) {
      this.templatesReady$.next(true);

      // If we already have data, update the table now
      if (this.currentUsers.length > 0) {
        setTimeout(() => {
          this.updateTableData(this.currentUsers);
          this.skeleton = false;
          this.cdr.detectChanges();
        });
      }
    } else {
      // Templates are not ready, set up a polling mechanism
      const checkTemplates = setInterval(() => {
        if (this.statusTemplate && this.actionTemplate) {
          this.templatesReady$.next(true);

          // If we already have data, update the table now
          if (this.currentUsers.length > 0) {
            this.updateTableData(this.currentUsers);
            this.skeleton = false;
            this.cdr.detectChanges();
          }

          clearInterval(checkTemplates);
        }
      }, 50); // Check every 50ms

      // Clean up interval if component is destroyed
      this.destroy$.subscribe(() => clearInterval(checkTemplates));
    }

    // Force an update after a short delay as a fallback
    setTimeout(() => {
      if (this.currentUsers.length > 0 && this.templatesReady$.getValue()) {
        this.updateTableData(this.currentUsers);
        this.skeleton = false;
        this.cdr.detectChanges();
      }
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTable(columns: any) {
    this.model.header = [
      new TableHeaderItem({
        data: columns.email || 'Email',
        sortable: true,
      }),
      new TableHeaderItem({
        data: columns.ward || 'Ward',
        sortable: true,
      }),
      new TableHeaderItem({
        data: columns.approvalStatus || 'Status',
        sortable: true,
      }),
      new TableHeaderItem({
        data: columns.actions || 'Actions',
      }),
    ];
  }

  private updateTableData(users: UserResponse[]) {
    // Make sure we have templates and data
    if (!this.statusTemplate || !this.actionTemplate || users.length === 0) {
      return;
    }

    try {
      // Update the table data
      this.model.data = users.map((user) => [
        new TableItem({
          data: user.email,
          title: user.email,
        }),
        new TableItem({
          data: this.getWardLabel(user.wardNumber),
          title: this.getWardLabel(user.wardNumber),
        }),
        new TableItem({
          data: user.isApproved, // Pass the boolean value
          template: this.statusTemplate,
        }),
        new TableItem({
          data: user,
          template: this.actionTemplate,
        }),
      ]);

      // Turn off skeleton loading if it's still on
      if (this.skeleton) {
        this.skeleton = false;
      }
    } catch (error) {
      console.error('Error updating table data:', error);
    }
  }

  private updateQueryParams(filter: UserFilter) {
    // Update URL without navigation
    const queryParams: any = {};

    if (filter.page && filter.page !== 1) queryParams.page = filter.page;
    if (filter.size && filter.size !== 10) queryParams.size = filter.size;
    if (filter.sortBy && filter.sortBy !== 'createdAt')
      queryParams.sortBy = filter.sortBy;
    if (filter.sortDirection && filter.sortDirection !== 'DESC')
      queryParams.sortDirection = filter.sortDirection;
    if (filter.searchTerm) queryParams.searchTerm = filter.searchTerm;
    if (filter.isApproved !== undefined)
      queryParams.isApproved = filter.isApproved;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true, // Use replaceUrl to avoid new history entries
    });
  }

  getWardLabel(wardNumber: number | null): string {
    if (wardNumber === null || wardNumber === undefined) {
      return this.transloco.translate('user.municipality');
    }
    
    const formattedNumber = this.numberFormat.formatNumber(wardNumber);
    return `${this.transloco.translate('user.ward')} ${formattedNumber}`;
  }

  // Event handlers
  onCreateUser() {
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(userId: string) {
    this.router.navigate([`/dashboard/users/edit/${userId}`]);
  }

  onDeleteUser(userId: string) {
    const user = this.currentUsers.find((u) => u.id === userId);
    if (!user) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('user.delete.confirmTitle'),
        message: this.transloco.translate('user.delete.confirmMessage', {
          name: user.email,
        }),
        confirmButton: this.transloco.translate('common.delete'),
        cancelButton: this.transloco.translate('common.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(UserActions.deleteUser({ id: userId }));
      }
    });
  }

  onToggleStatus(userId: string): void {
    const user = this.currentUsers.find((u) => u.id === userId);
    if (!user || user.isApproved) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('user.approve.confirmTitle'),
        message: this.transloco.translate('user.approve.confirmMessage', {
          email: user.email,
        }),
        confirmButton: this.transloco.translate('common.action.confirm'),
        cancelButton: this.transloco.translate('common.action.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(UserActions.approveUser({ id: userId }));
      }
    });
  }

  selectPage(page: number) {
    this.store.dispatch(
      UserActions.setPage({
        pageIndex: page,
        pageSize: this.model.pageLength || 10,
      })
    );
  }

  filterUsers(searchString: string) {
    this.searchTerm = searchString;
    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          searchTerm: searchString,
          page: 1, // Reset to first page on filter
        },
      })
    );
  }

  toggleApprovalFilter(showPending: boolean) {
    this.showOnlyPending = showPending;
    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          isApproved: showPending ? false : undefined,
          page: 1,
        },
      })
    );
  }

  sortTable(index: number) {
    // Get column name based on index
    let sortField: string;
    switch (index) {
      case 0:
        sortField = 'email';
        break;
      case 1:
        sortField = 'wardNumber';
        break;
      case 2:
        sortField = 'isApproved';
        break;
      default:
        sortField = 'createdAt';
    }

    // Toggle sort direction
    const currentHeader = this.model.header[index] as TableHeaderItem;
    const sortDirection = currentHeader.ascending ? 'ASC' : 'DESC';

    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          sortBy: sortField,
          sortDirection: sortDirection,
        },
      })
    );
  }
}
