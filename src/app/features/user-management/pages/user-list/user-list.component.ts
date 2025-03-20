import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  map,
  take,
} from 'rxjs/operators';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { MatDialog } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { UrlParamsService } from '../../services/url-params.service';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

// Components
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { UserSearchComponent } from '../../components/user-search/user-search.component';
import { UserFiltersComponent } from '../../components/user-filters/user-filters.component';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { SortControlsComponent } from '../../components/sort-controls/sort-controls.component';
import { PageEvent } from '@shared/components/paginator/paginator.component';

// Models & Actions
import {
  ALLOWED_COLUMNS,
  UserFilter,
  UserFilterFormValue,
  UserResponse,
} from '../../models/user.interface';
import { UserActions } from '../../store/user.actions';
import * as UserSelectors from '../../store/user.selectors';
import { RoleType } from '@app/core/models/role.enum';
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
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDatepickerModule,
    TranslocoModule,
    PageTitleComponent,
    UserSearchComponent,
    UserFiltersComponent,
    UsersTableComponent,
    SortControlsComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    provideTranslocoScope({
      scope: 'user-management',
      alias: 'user',
    }),
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'email',
    'ward',
    'permissions',
    'approvalStatus',
    'actions',
  ];

  dataSource = new MatTableDataSource<UserResponse>();
  filterForm: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserLoading).pipe(
    map((loading) => loading ?? false) // provide default value
  );

  totalUsers$ = this.store.select(UserSelectors.selectTotalUsers).pipe(
    map((total) => total ?? 0) // provide default value
  );

  hasUsers$ = this.totalUsers$.pipe(
    map((total) => total > 0),
    distinctUntilChanged()
  );

  roleTypes = Object.values(RoleType);
  permissionTypes = Object.values(PermissionType); // Add this line
  private destroy$ = new Subject<void>();

  showFilters = false;
  searchControl = new FormControl('');

  // Add ViewChild refs for the new components
  @ViewChild(UsersTableComponent) usersTable!: UsersTableComponent;

  // Prevent jittery updates by using BehaviorSubjects
  private filtersSubject = new BehaviorSubject<UserFilter>({});
  filters$ = this.filtersSubject
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

  // Add currentPage state
  currentPage = 1;

  // Add pagination selectors
  currentPage$ = this.store.select(UserSelectors.selectCurrentPage);
  pageSize$ = this.store.select(UserSelectors.selectPageSize);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private transloco: TranslocoService,
    private route: ActivatedRoute,
    private urlParamsService: UrlParamsService
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      email: [''],
      isApproved: [null],
      isWardLevelUser: [null],
      wardNumber: [null, [Validators.min(1), Validators.max(5)]], // Updated ward number control
      createdAfter: [null],
      createdBefore: [null],
      permissions: [[]],
      columns: [ALLOWED_COLUMNS],
      page: [1], // Always start at page 1
      size: [10],
      sortBy: ['createdAt'], // Ensure default sort is createdAt
      sortDirection: ['DESC'], // Ensure default direction is DESC
    });

    // Modify filter subscription to handle pagination
    this.filters$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) =>
            JSON.stringify({ ...prev, page: undefined }) ===
            JSON.stringify({ ...curr, page: undefined })
        )
      )
      .subscribe((filters) => {
        // If filters changed (excluding page), reset to first page
        if (
          JSON.stringify({ ...filters, page: undefined }) !==
          JSON.stringify({ ...this.filterForm.value, page: undefined })
        ) {
          this.filterForm.patchValue({ page: 1 }, { emitEvent: false });
        }
        this.loadUsers(filters);
      });
  }

  ngOnInit(): void {
    // First handle URL parameters
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const validParams = this.urlParamsService.parseQueryParams(params);
      const userFilter = this.urlParamsService.convertToUserFilter(validParams);

      // Set initial form values
      this.filterForm.patchValue(
        {
          ...userFilter,
          page: userFilter.page ?? 1,
          size: userFilter.size ?? 10,
          sortBy: userFilter.sortBy ?? 'createdAt',
          sortDirection: userFilter.sortDirection ?? 'DESC',
        },
        { emitEvent: false }
      );

      // Initialize data with these parameters
      this.initializeData(userFilter);
    });

    // Then set up subscriptions
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    // Subscribe to store selectors
    combineLatest([
      this.store.select(UserSelectors.selectUsers),
      this.store.select(UserSelectors.selectPagination),
      this.store.select(UserSelectors.selectUserLoading),
    ])
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(([users, pagination, loading]) => {
        // Update data source
        this.dataSource.data = users;

        // Update pagination state
        if (!loading) {
          this.currentPage = pagination.currentPage;
          if (
            this.filterForm.get('page')?.value !== pagination.currentPage ||
            this.filterForm.get('size')?.value !== pagination.pageSize
          ) {
            this.filterForm.patchValue(
              {
                page: pagination.currentPage,
                size: pagination.pageSize,
              },
              { emitEvent: false }
            );

            // Update URL params
            this.urlParamsService.updateQueryParams(this.filterForm.value);
          }
        }
      });

    // Set up other subscriptions
    this.setupFilterSubscription();
  }

  private initializeData(initialFilter?: UserFilter): void {
    const defaultFilter: UserFilter = {
      page: initialFilter?.page ?? 1, // Ensure page is 1-based
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
      ...initialFilter,
    };

    this.searchControl.setValue('');
    this.dataSource = new MatTableDataSource<UserResponse>([]);

    // Ensure we start with page 1 in the form
    this.filterForm.patchValue(
      {
        ...defaultFilter,
        page: defaultFilter.page || 1,
      },
      { emitEvent: false }
    );

    this.loadUsers(defaultFilter);
  }

  private setupFilterSubscription(): void {
    // Search control with throttling
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300), // Wait for 300ms after last input
        distinctUntilChanged(),
        map((value) => value?.trim() || '') // Sanitize input
      )
      .subscribe((searchTerm) => {
        // Update the form with search term
        this.filterForm.patchValue({ searchTerm }, { emitEvent: false });
        // Trigger the search
        this.loadUsers({
          ...this.filterForm.value,
          searchTerm: searchTerm || undefined,
          page: 1, // Reset to first page on search
        });
      });

    // Filter form changes (excluding search)
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        map((formValue) => this.sanitizeFilterValues(formValue))
      )
      .subscribe((filter) => {
        this.loadUsers(filter);
      });
  }

  private sanitizeFilterValues(formValue: UserFilterFormValue): UserFilter {
    return {
      ...formValue,
      searchTerm: formValue.searchTerm?.trim() || undefined,
      permissions: formValue.permissions?.length
        ? formValue.permissions
        : undefined,
      createdAfter: formValue.createdAfter
        ? new Date(formValue.createdAfter).toISOString().split('T')[0]
        : undefined,
      createdBefore: formValue.createdBefore
        ? new Date(formValue.createdBefore).toISOString().split('T')[0]
        : undefined,
      email: formValue.email || undefined,
      isApproved: formValue.isApproved ?? undefined,
      isWardLevelUser: formValue.isWardLevelUser ?? undefined,
      wardNumber: formValue.wardNumber ?? undefined,
    };
  }

  private loadUsers(filter: UserFilter): void {
    // Ensure all required pagination values are present
    const finalFilter: UserFilter = {
      page: filter.page ?? 1, // Default to page 1
      size: filter.size ?? this.filterForm.get('size')?.value ?? 10,
      sortBy: filter.sortBy ?? 'createdAt',
      sortDirection: filter.sortDirection ?? 'DESC',
      ...filter,
    };

    // Update URL first
    this.urlParamsService.updateQueryParams(finalFilter);

    // Then dispatch action
    this.store.dispatch(UserActions.loadUsers({ filter: finalFilter }));
  }

  onCreateUser(): void {
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(id: string): void {
    this.router.navigate(['/dashboard/users/edit', id]);
  }

  onDeleteUser(user: UserResponse): void {
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
        this.store.dispatch(UserActions.deleteUser({ id: user.id }));
      }
    });
  }

  onToggleStatus(user: UserResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate(
          user.isApproved
            ? 'user.disapprove.confirmTitle'
            : 'user.approve.confirmTitle'
        ),
        message: this.transloco.translate(
          user.isApproved
            ? 'user.disapprove.confirmMessage'
            : 'user.approve.confirmMessage',
          { email: user.email }
        ),
        confirmButton: this.transloco.translate(
          user.isApproved ? 'common.disapprove' : 'common.approve'
        ),
        cancelButton: this.transloco.translate('common.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.store.dispatch(
        //   UserActions.setApprovalStatus({
        //     id: user.id,
        //     approved: !user.isApproved,
        //   })
        // );
      }
    });
  }

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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Update filter handling
  private updateFilters(newFilters: Partial<UserFilter>) {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...newFilters,
    });
  }

  onSearch(searchTerm: string) {
    const currentFilters = this.filterForm.value;
    const newFilters = {
      ...currentFilters,
      searchTerm,
      page: 1, // Reset to first page when searching
    };

    this.filterForm.patchValue(newFilters, { emitEvent: false });
    this.loadUsers(newFilters);
  }

  onFiltersChange(filters: UserFilter) {
    const newFilters = {
      ...this.filterForm.value,
      ...filters,
      page: 1, // Reset to first page when filters change
    };

    this.filterForm.patchValue(newFilters, { emitEvent: false });
    this.loadUsers(newFilters);
  }

  onSortChange(event: { sortBy: string; direction: 'ASC' | 'DESC' }): void {
    const currentFilters = this.filterForm.value;
    const newFilters = {
      ...currentFilters,
      sortBy: event.sortBy,
      sortDirection: event.direction,
      // Maintain current page when sorting
      page: this.currentPage,
      size: currentFilters.size,
    };

    this.filterForm.patchValue(newFilters, { emitEvent: false });
    this.loadUsers(newFilters);
  }

  onPageEvent(event: PageEvent): void {
    // event.pageIndex is already 1-based from our paginator
    const newFilters: UserFilter = {
      ...this.filterForm.value,
      page: event.pageIndex,
      size: event.pageSize,
    };

    this.filterForm.patchValue(newFilters, { emitEvent: false });
    this.loadUsers(newFilters);
  }
}
