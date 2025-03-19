import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { MatDialog } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';

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
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

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
    EmptyStateComponent,
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
  private destroy$ = new Subject<void>();

  showFilters = false;
  searchControl = new FormControl('');

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) {
    this.filterForm = this.fb.group({
      email: [''],
      isApproved: [null],
      isWardLevelUser: [null],
      wardNumberFrom: [null],
      wardNumberTo: [null],
      createdAfter: [null],
      createdBefore: [null],
      permissions: [[]],
      columns: [ALLOWED_COLUMNS],
      page: [0],
      size: [10],
      sortBy: ['createdAt'],
      sortDirection: ['DESC'],
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.setupFilterSubscription();
  }

  private initializeData(): void {
    this.loadUsers();

    this.store
      .select(UserSelectors.selectUsers)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  private setupFilterSubscription(): void {
    // Add type safety to form values
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
      createdAfter: formValue.createdAfter
        ? new Date(formValue.createdAfter).toISOString().split('T')[0]
        : undefined,
      createdBefore: formValue.createdBefore
        ? new Date(formValue.createdBefore).toISOString().split('T')[0]
        : undefined,
      email: formValue.email || undefined,
      isApproved: formValue.isApproved ?? undefined,
      isWardLevelUser: formValue.isWardLevelUser ?? undefined,
      wardNumberFrom: formValue.wardNumberFrom ?? undefined,
      wardNumberTo: formValue.wardNumberTo ?? undefined,
    };
  }

  loadUsers(filterOverride?: UserFilter): void {
    const formValue = this.filterForm.value;
    const filter: UserFilter = filterOverride || {
      ...formValue,
      createdAfter: formValue.createdAfter?.toISOString().split('T')[0],
      createdBefore: formValue.createdBefore?.toISOString().split('T')[0],
    };

    // Clean up undefined/null values
    Object.keys(filter).forEach(
      (key) =>
        (filter[key as keyof UserFilter] === null ||
          filter[key as keyof UserFilter] === undefined) &&
        delete filter[key as keyof UserFilter]
    );

    this.store.dispatch(UserActions.loadUsers({ filter }));
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
}
