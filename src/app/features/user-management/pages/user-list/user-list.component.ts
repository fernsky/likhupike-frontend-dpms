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
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, distinctUntilChanged, map, take } from 'rxjs/operators';
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

  currentFilter$ = this.store.select(UserSelectors.selectCurrentFilter);
  sortState$ = this.store.select(UserSelectors.selectSortState);

  // Add users$ stream
  users$ = this.store.select(UserSelectors.selectUsers);

  hasError$ = this.store
    .select(UserSelectors.selectUserErrors)
    .pipe(map((errors) => errors?.status === 400));

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
        // Update store with URL params
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

        // Update form controls
        this.filterForm.patchValue(filter, { emitEvent: false });
        if (filter.searchTerm) {
          this.searchControl.setValue(filter.searchTerm, { emitEvent: false });
        }
      });

    // Subscribe to users data for the table
    this.users$.pipe(takeUntil(this.destroy$)).subscribe((users) => {
      if (users) {
        this.dataSource.data = users;
      }
    });

    // Add subscription to page changes
    this.currentPage$.pipe(takeUntil(this.destroy$)).subscribe((page) => {
      this.currentPage = page;
    });
  }

  ngOnDestroy(): void {
    // Don't clear URL params on component destroy
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCreateUser(): void {
    // Clear URL params before navigating to create page
    this.urlParamsService.clearUrlParams();
    this.router.navigate(['/dashboard/users/create']);
  }

  onEditUser(id: string): void {
    // Clear URL params before navigating to edit page
    this.urlParamsService.clearUrlParams();
    this.router.navigate(['/dashboard/users/edit', id], {
      queryParams: { tab: 0 },
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

  onSearch(searchTerm: string) {
    this.store.dispatch(UserActions.filterChange({ filter: { searchTerm } }));
  }

  onFiltersChange(filters: UserFilter) {
    // Merge with current filter state to maintain pagination/sorting
    const currentFilter = this.store
      .select(UserSelectors.selectCurrentFilter)
      .pipe(take(1));

    currentFilter.subscribe((current) => {
      if (Object.keys(filters).length === 0) {
        // If filters are empty, reset to default state
        this.store.dispatch(UserActions.resetFilters());
      } else {
        // Merge new filters with current state
        const mergedFilter = {
          ...current,
          ...filters,
          page: filters.page || current.page || 1,
        };
        this.store.dispatch(UserActions.filterChange({ filter: mergedFilter }));
      }
    });
  }

  onSortChange(event: { sortBy: string; direction: 'ASC' | 'DESC' }): void {
    const sortFilter = {
      sortBy: event.sortBy,
      sortDirection: event.direction,
    };
    this.store.dispatch(UserActions.filterChange({ filter: sortFilter }));
  }

  onPageEvent(event: PageEvent): void {
    // First update the URL through the store
    this.store.dispatch(UserActions.setPage(event));
    // Update the component's current page
    this.currentPage = event.pageIndex;
  }
}
