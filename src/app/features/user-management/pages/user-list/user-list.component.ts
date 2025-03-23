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
import { Subject, BehaviorSubject, merge } from 'rxjs';
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
import { PageTitleButtonComponent } from '@app/shared/components/page-title-button/page-title-button.component';

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
    PageTitleButtonComponent,
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
  }

  ngOnInit(): void {
    // Handle initial load
    this.route.queryParams
      .pipe(
        take(1),
        map((params) => {
          const userFilter = this.urlParamsService.convertToUserFilter(
            this.urlParamsService.parseQueryParams(params)
          );
          return {
            page: userFilter.page ?? 1,
            size: userFilter.size ?? 10,
            sortBy: userFilter.sortBy ?? 'createdAt',
            sortDirection: userFilter.sortDirection ?? 'DESC',
            ...userFilter,
          };
        })
      )
      .subscribe((initialFilter) => {
        // Set initial values silently
        this.filterForm.patchValue(initialFilter, { emitEvent: false });
        if (initialFilter.searchTerm) {
          this.searchControl.setValue(initialFilter.searchTerm, {
            emitEvent: false,
          });
        }

        // Initial data load
        this.store.dispatch(UserActions.loadUsers({ filter: initialFilter }));
        this.setupSubscriptions();
      });
  }

  private setupSubscriptions(): void {
    // Data updates subscription
    this.store
      .select(UserSelectors.selectUsers)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.dataSource.data = users;
      });

    // Pagination updates subscription
    this.store
      .select(UserSelectors.selectPagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe((pagination) => {
        // Only update form if pagination actually changed
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
          ); // Don't trigger another API call
        }
      });

    // Create a single stream for filter changes
    const filterChanges$ = merge(
      // Form value changes excluding page changes
      this.filterForm.valueChanges.pipe(
        map((formValue) => {
          const newFilter = this.sanitizeFilterValues(formValue);
          // Don't reset page when only page/size changes
          if (
            Object.keys(newFilter).length === 2 &&
            ('page' in newFilter || 'size' in newFilter)
          ) {
            return newFilter;
          }
          // Reset to page 1 for other filter changes
          return { ...newFilter, page: 1 };
        })
      ),
      // Search changes (always reset page to 1)
      this.searchControl.valueChanges.pipe(
        map((searchTerm) => ({
          ...this.filterForm.value,
          searchTerm: searchTerm?.trim() || '',
          page: 1,
        }))
      )
    ).pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );

    // Handle all filter changes in a single subscription
    filterChanges$.subscribe((filter) => {
      this.urlParamsService.updateQueryParams(filter);
      this.store.dispatch(UserActions.loadUsers({ filter }));
    });
  }

  private sanitizeFilterValues(formValue: UserFilterFormValue): UserFilter {
    const filter: UserFilter = {
      page: formValue.page,
      size: formValue.size,
      sortBy: formValue.sortBy,
      sortDirection: formValue.sortDirection,
    };

    // Only add other filters if they have values
    if (formValue.searchTerm?.trim())
      filter.searchTerm = formValue.searchTerm.trim();
    if (formValue.permissions?.length)
      filter.permissions = formValue.permissions;
    if (formValue.email?.trim()) filter.email = formValue.email.trim();
    if (formValue.isApproved !== null) filter.isApproved = formValue.isApproved;
    if (formValue.isWardLevelUser !== null)
      filter.isWardLevelUser = formValue.isWardLevelUser;
    if (formValue.wardNumber !== null) filter.wardNumber = formValue.wardNumber;
    if (formValue.createdAfter) {
      filter.createdAfter = new Date(formValue.createdAfter)
        .toISOString()
        .split('T')[0];
    }
    if (formValue.createdBefore) {
      filter.createdBefore = new Date(formValue.createdBefore)
        .toISOString()
        .split('T')[0];
    }

    return filter;
  }

  onCreateUser(): void {
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(id: string): void {
    // Navigate to edit page with query param to select the first tab (details)
    this.router.navigate(['/dashboard/users/edit', id], {
      queryParams: { tab: 0 },
      // Preserve query params from the list page to return to the same state
      queryParamsHandling: 'merge',
    });
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
    if (user.isApproved) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('user.approve.confirmTitle'),
        // Use double curly braces for interpolation in the translation string
        message: this.transloco.translate('user.approve.confirmMessage', {
          email: user.email,
        }),
        confirmButton: this.transloco.translate('common.action.confirm'),
        cancelButton: this.transloco.translate('common.action.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(UserActions.approveUser({ id: user.id }));
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
    this.searchControl.setValue(searchTerm, { emitEvent: true });
  }

  onFiltersChange(filters: UserFilter) {
    const newFilters = { ...filters, page: 1 };
    this.filterForm.patchValue(newFilters, { emitEvent: true });
  }

  onSortChange(event: { sortBy: string; direction: 'ASC' | 'DESC' }): void {
    this.filterForm.patchValue(
      {
        sortBy: event.sortBy,
        sortDirection: event.direction,
      },
      { emitEvent: true }
    );
  }

  onPageEvent(event: PageEvent): void {
    // Update form with new page values and trigger API call
    const newFilter = {
      ...this.filterForm.value,
      page: event.pageIndex,
      size: event.pageSize,
    };

    // Update URL and trigger API call directly instead of going through form changes
    this.urlParamsService.updateQueryParams(newFilter);
    this.store.dispatch(UserActions.loadUsers({ filter: newFilter }));

    // Update form without emitting event to avoid duplicate calls
    this.filterForm.patchValue(newFilter, { emitEvent: false });
  }

  private isPaginationOnlyChange(filter: UserFilter): boolean {
    const currentValues = this.filterForm.value;
    const changedKeys = Object.keys(filter).filter(
      (key) =>
        filter[key as keyof UserFilter] !==
        currentValues[key as keyof UserFilter]
    );
    return (
      changedKeys.length === 1 &&
      (changedKeys[0] === 'page' || changedKeys[0] === 'size')
    );
  }
}
