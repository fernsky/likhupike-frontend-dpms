/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnInit,
  inject,
  ViewChild,
  TemplateRef,
  OnDestroy,
  AfterViewInit,
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
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, distinctUntilChanged, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Stream control
  private destroy$ = new Subject<void>();
  private filtersSubject = new BehaviorSubject<UserFilter>({});
  filters$ = this.filtersSubject
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

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
  showOnlyApproved = false;

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
    ]);
    this.initializeTable();
  }

  ngOnInit() {
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
          isApproved: params['isApproved'] === 'true' ? true : undefined,
        };

        this.searchTerm = initialFilter.searchTerm || '';
        this.showOnlyApproved = initialFilter.isApproved || false;

        // Dispatch initial filter
        this.store.dispatch(UserActions.loadUsers({ filter: initialFilter }));
      });

    // Subscribe to current filter changes
    this.currentFilter$.pipe(takeUntil(this.destroy$)).subscribe((filter) => {
      this.currentPage = filter.page || 1;
      this.pageSize = filter.size || 10;
      this.searchTerm = filter.searchTerm || '';
      this.showOnlyApproved = filter.isApproved || false;

      // Update URL query params
      this.updateQueryParams(filter);
    });

    // Subscribe to loading state
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.skeleton = loading;
    });

    // Subscribe to pagination changes
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      if (pagination) {
        this.model.pageLength = pagination.pageSize;
        this.model.totalDataLength = pagination.totalElements;
        this.model.currentPage = pagination.currentPage;
      }
    });

    // Listen for changes in users and update table when templates are available
    combineLatest([
      this.users$,
      new Observable<boolean>((observer) => {
        if (this.statusTemplate && this.actionTemplate) {
          observer.next(true);
        }

        // Set up MutationObserver to detect when templates become available
        const interval = setInterval(() => {
          if (this.statusTemplate && this.actionTemplate) {
            observer.next(true);
            clearInterval(interval);
          }
        }, 100);

        return () => clearInterval(interval);
      }),
    ])
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => {
          // Only update if users array changes
          return JSON.stringify(prev[0]) === JSON.stringify(curr[0]);
        })
      )
      .subscribe(([users, templatesReady]) => {
        if (templatesReady && users) {
          this.updateTableData(users);
        }
      });
  }

  ngAfterViewInit() {
    // After view init, check if we have users data and update table
    setTimeout(() => {
      this.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
        if (users?.length && this.statusTemplate && this.actionTemplate) {
          this.updateTableData(users);
        }
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTable() {
    this.model.header = [
      new TableHeaderItem({
        data: 'Email',
        sortable: true,
      }),
      new TableHeaderItem({
        data: 'Ward',
        sortable: true,
      }),
      new TableHeaderItem({
        data: 'Status',
        sortable: true,
      }),
      new TableHeaderItem({ data: 'Actions' }),
    ];

    // Enable pagination
    this.model.pageLength = 10;
    this.model.totalDataLength = 0;
  }

  private updateTableData(users: UserResponse[]) {
    if (!this.statusTemplate || !this.actionTemplate) {
      return;
    }

    this.model.data = users.map((user) => [
      new TableItem({
        data: user.email,
        title: user.email,
      }),
      new TableItem({
        data: user.wardNumber || 'N/A',
        title: user.wardNumber ? `Ward ${user.wardNumber}` : 'N/A',
      }),
      new TableItem({
        data: user.isApproved ? 'Approved' : 'Pending',
        template: this.statusTemplate,
      }),
      new TableItem({
        data: user,
        template: this.actionTemplate,
      }),
    ]);
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
    });
  }

  // Event handlers
  onCreateUser() {
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(userId: string) {
    this.router.navigate([`/dashboard/users/edit/${userId}`]);
  }

  onDeleteUser(userId: string) {
    // Add confirmation dialog here if needed
    this.store.dispatch(UserActions.deleteUser({ id: userId }));
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

  toggleApprovalFilter(showApproved: boolean) {
    this.showOnlyApproved = showApproved;
    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          isApproved: showApproved,
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
          // Don't reset page on sort change
        },
      })
    );
  }
}
