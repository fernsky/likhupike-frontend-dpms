import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, distinctUntilChanged, map, filter } from 'rxjs/operators';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { UrlParamsService } from '../../services/url-params.service';

// Carbon Imports
import {
  ButtonModule,
  TableModule,
  TableModel,
  TableHeaderItem,
  TableItem,
  SearchModule,
  PaginationModule,
  LoadingModule,
  ModalModule,
  ModalService,
  IconModule,
  DropdownModule,
  CheckboxModule,
  DatePickerModule,
  InputModule,
  TagModule,
  UIShellModule,
  NotificationModule,
  DialogModule,
  GridModule,
  TilesModule,
  PlaceholderModule,
} from 'carbon-components-angular';

// Components
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmModalComponent } from '@app/shared/components/modals/confirm-modal.component';
import { AlertModalComponent } from '@app/shared/components/modals/alert-modal.component';
import { AppModalService } from '@app/shared/services/modal.service';

// Models & Actions
import {
  ALLOWED_COLUMNS,
  UserFilter,
  UserResponse,
} from '../../models/user.interface';
import { UserActions } from '../../store/user.actions';
import * as UserSelectors from '../../store/user.selectors';
import { PermissionType } from '@app/core/models/permission.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    BreadcrumbComponent,

    // Carbon modules
    ButtonModule,
    TableModule,
    SearchModule,
    PaginationModule,
    LoadingModule,
    IconModule,
    DropdownModule,
    CheckboxModule,
    DatePickerModule,
    InputModule,
    TagModule,
    UIShellModule,
    NotificationModule,
    DialogModule,
    GridModule,
    TilesModule,
    PlaceholderModule,
    ModalModule,

    // New modal components
    ConfirmModalComponent,
    AlertModalComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
      alias: 'user',
    }),
  ],
})
export class UserListComponent implements OnInit, OnDestroy {
  // Carbon-specific table model
  tableModel = new TableModel();

  // Filter form
  filterForm: FormGroup;

  // Search state
  searchValue = '';

  // Observables
  loading$ = this.store
    .select(UserSelectors.selectUserLoading)
    .pipe(map((loading) => loading ?? false));

  totalUsers$ = this.store
    .select(UserSelectors.selectTotalUsers)
    .pipe(map((total) => total ?? 0));

  users$ = this.store.select(UserSelectors.selectUsers);

  hasUsers$ = this.totalUsers$.pipe(
    map((total) => total > 0),
    distinctUntilChanged()
  );

  // Filter state trackers
  showFilters = false;
  currentFilter$ = this.store.select(UserSelectors.selectCurrentFilter);
  sortState$ = this.store.select(UserSelectors.selectSortState);

  // Pagination state
  currentPage$ = this.store.select(UserSelectors.selectCurrentPage);
  pageSize$ = this.store.select(UserSelectors.selectPageSize);
  currentPage = 1;
  pageSize = 10;

  // Error state
  hasError$ = this.store
    .select(UserSelectors.selectUserErrors)
    .pipe(map((errors) => errors?.status === 400));

  // Options for dropdowns and filters
  permissionTypes = Object.values(PermissionType);
  wardNumberOptions = Array.from({ length: 5 }, (_, i) => ({
    content: this.transloco.translate('user.list.filters.ward.prefix', {
      number: i + 1,
    }),
    value: i + 1,
    selected: false,
  }));

  // For date filters
  dateFormat = 'Y/m/d';

  // Sort options
  sortOptions = [
    {
      content: this.transloco.translate('user.list.columns.email'),
      value: 'email',
      selected: false,
    },
    {
      content: this.transloco.translate('user.list.sort.createdAt'),
      value: 'createdAt',
      selected: false,
    },
    {
      content: this.transloco.translate('user.list.sort.updatedAt'),
      value: 'updatedAt',
      selected: false,
    },
  ];

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private appModalService: AppModalService,
    private transloco: TranslocoService,
    private route: ActivatedRoute,
    private urlParamsService: UrlParamsService
  ) {
    // Initialize form
    this.filterForm = this.fb.group({
      searchTerm: [''],
      email: [''],
      isApproved: [null],
      isWardLevelUser: [null],
      wardNumber: [null, [Validators.min(1), Validators.max(5)]],
      createdAfter: [null],
      createdBefore: [null],
      permissions: [[]],
      columns: [ALLOWED_COLUMNS],
      page: [1],
      size: [10],
      sortBy: ['createdAt'],
      sortDirection: ['DESC'],
    });

    // Initialize table headers
    this.initializeTableHeaders();
  }

  ngOnInit(): void {
    // Initialize data
    this.setupTableData();

    // Subscribe to URL params and sync with state
    this.urlParamsService
      .syncUrlToState()
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((urlFilter) => {
        this.store.dispatch(UserActions.filterChange({ filter: urlFilter }));
      });

    // Subscribe to store filter changes and update URL
    this.store
      .select(UserSelectors.selectCurrentFilter)
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((filter) => {
        this.urlParamsService.updateQueryParams(filter);
        this.filterForm.patchValue(filter, { emitEvent: false });
        this.searchValue = filter.searchTerm || '';
      });

    // Update pagination values
    combineLatest([
      this.currentPage$.pipe(filter((page) => page !== undefined)),
      this.pageSize$.pipe(filter((size) => size !== undefined)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([page, size]) => {
        this.currentPage = page;
        this.pageSize = size;
      });
  }

  private initializeTableHeaders(): void {
    this.tableModel.header = [
      new TableHeaderItem({
        data: this.transloco.translate('user.list.columns.email'),
        sortable: true,
      }),
      new TableHeaderItem({
        data: this.transloco.translate('user.list.columns.ward'),
        sortable: true,
      }),
      new TableHeaderItem({
        data: this.transloco.translate('user.list.columns.permissions'),
        sortable: false,
      }),
      new TableHeaderItem({
        data: this.transloco.translate('user.list.columns.approvalStatus'),
        sortable: true,
      }),
      new TableHeaderItem({
        data: this.transloco.translate('common.actions.label'),
        sortable: false,
      }),
    ];
  }

  private setupTableData(): void {
    // Subscribe to users data and update table
    this.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      if (!users) return;

      // Transform users data into Carbon table format
      const tableData = users.map((user) => this.createTableRow(user));
      this.tableModel.data = tableData;
    });
  }

  private createTableRow(user: UserResponse): TableItem[] {
    return [
      // Email cell
      new TableItem({ data: user.email }),

      // Ward cell
      new TableItem({
        data: user.isWardLevelUser ? this.getWardLabel(user.wardNumber) : '',
        template: user.isWardLevelUser ? undefined : null, // Only use template when there's data
      }),

      // Permissions cell
      new TableItem({
        data: user.permissions,
        template: this.permissionsCellTemplate,
        context: {
          permissions: user.permissions,
          permissionLabels: this.getPermissionLabels(user.permissions),
        },
      }),

      // Status cell
      new TableItem({
        data: user.isApproved,
        template: this.statusCellTemplate,
        context: { isApproved: user.isApproved },
      }),

      // Actions cell
      new TableItem({
        data: user,
        template: this.actionsCellTemplate,
        context: { user },
      }),
    ];
  }

  // Templates for custom cell rendering
  @ViewChild('permissionsCellTemplate', { static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissionsCellTemplate!: TemplateRef<any>;
  @ViewChild('statusCellTemplate', { static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  statusCellTemplate!: TemplateRef<any>;
  @ViewChild('actionsCellTemplate', { static: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionsCellTemplate!: TemplateRef<any>;

  // Event handlers
  onCreateUser(): void {
    this.urlParamsService.clearUrlParams();
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(id: string): void {
    this.urlParamsService.clearUrlParams();
    this.router.navigate(['/dashboard/users/edit', id], {
      queryParams: { tab: 0 },
    });
  }

  onSort(index: number): void {
    // Carbon table sorts by column index
    if (!this.tableModel.header[index].sortable) {
      return;
    }

    // Get current sort state
    const currentSortIndex = this.tableModel.header.findIndex(
      (item) => item.sorted
    );
    const currentDirection =
      currentSortIndex > -1
        ? this.tableModel.header[currentSortIndex].ascending
          ? 'ASC'
          : 'DESC'
        : 'DESC';

    // Determine new sort direction
    let newDirection: 'ASC' | 'DESC';
    if (currentSortIndex === index) {
      // Toggle direction on same column
      newDirection = currentDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Default to DESC for new column
      newDirection = 'DESC';
    }

    // Map column index to field name
    const columnToField: Record<number, string> = {
      0: 'email',
      1: 'wardNumber',
      3: 'isApproved',
    };

    // Find the field name
    const sortBy = columnToField[index] || 'createdAt';

    // Update sort in store
    this.store.dispatch(
      UserActions.filterChange({
        filter: {
          sortBy,
          sortDirection: newDirection,
        },
      })
    );
  }

  onDeleteUser(user: UserResponse): void {
    // Enterprise pattern: use the component-based modal approach
    this.appModalService.openComponentModal(ConfirmModalComponent, {
      title: this.transloco.translate('user.delete.confirmTitle'),
      message: this.transloco.translate('user.delete.confirmMessage', {
        name: user.email,
      }),
      confirmText: this.transloco.translate('common.delete'),
      cancelText: this.transloco.translate('common.cancel'),
      danger: true,
      size: 'sm',
      // Handle the confirm action
      confirm: () => {
        this.store.dispatch(UserActions.deleteUser({ id: user.id }));
      },
    });
  }

  onToggleStatus(user: UserResponse): void {
    if (user.isApproved) return;

    // Enterprise pattern: use the component-based modal approach
    this.appModalService.openComponentModal(ConfirmModalComponent, {
      title: this.transloco.translate('user.approve.confirmTitle'),
      message: this.transloco.translate('user.approve.confirmMessage', {
        email: user.email,
      }),
      confirmText: this.transloco.translate('common.action.confirm'),
      cancelText: this.transloco.translate('common.action.cancel'),
      size: 'sm',
      // Handle the confirm action
      confirm: () => {
        this.store.dispatch(UserActions.approveUser({ id: user.id }));
      },
    });
  }

  // Filtering methods
  onSearch(value: string): void {
    this.searchValue = value;
    this.store.dispatch(
      UserActions.filterChange({ filter: { searchTerm: value } })
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFiltersChange(filterValues: any): void {
    // Extract values from filter controls
    const filters: UserFilter = {};

    // Add non-empty values to filter
    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key] !== null && filterValues[key] !== '') {
        filters[key as keyof UserFilter] = filterValues[key];
      }
    });

    // Reset to page 1 when filters change
    filters.page = 1;

    this.store.dispatch(UserActions.filterChange({ filter: filters }));
  }

  clearFilters(): void {
    this.store.dispatch(UserActions.resetFilters());
  }

  // Pagination methods
  onPageChange(page: number): void {
    this.store.dispatch(
      UserActions.setPage({
        pageIndex: page,
        pageSize: this.pageSize,
      })
    );
  }

  onPageSizeChange(size: number): void {
    this.store.dispatch(
      UserActions.setPage({
        pageIndex: 1,
        pageSize: size,
      })
    );
  }

  // Helper methods
  getPermissionLabels(permissions: PermissionType[]): string[] {
    if (!Array.isArray(permissions)) return [];
    return permissions.map((permission) =>
      this.transloco.translate(`user.permissions.${permission}.title`)
    );
  }

  getWardLabel(wardNumber: number | null): string {
    return wardNumber === null
      ? this.transloco.translate('user.municipality')
      : `${this.transloco.translate('user.ward')} ${wardNumber}`;
  }

  // Sort helpers
  getSortIcon(headerIndex: number): string {
    const header = this.tableModel.header[headerIndex];
    if (!header || !header.sorted) return 'arrows-vertical';
    return header.ascending ? 'arrow--up' : 'arrow--down';
  }

  // Cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
