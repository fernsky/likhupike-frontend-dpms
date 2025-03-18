import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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

import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
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
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
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
    MatDialogModule,
    MatDividerModule,
    MatDatepickerModule,
  ],
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'email',
    'wardNumber',
    'permissions',
    'approvalStatus', // Changed from 'status'
    'actions',
  ];

  dataSource = new MatTableDataSource<UserResponse>();
  filterForm: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserLoading);
  totalUsers$ = this.store.select(UserSelectors.selectTotalUsers);
  roleTypes = Object.values(RoleType);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
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
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(() => {
        const formValue = this.filterForm.value;
        // Format dates to ISO string before sending to API
        const filter: UserFilter = {
          ...formValue,
          createdAfter: formValue.createdAfter
            ? new Date(formValue.createdAfter).toISOString().split('T')[0]
            : undefined,
          createdBefore: formValue.createdBefore
            ? new Date(formValue.createdBefore).toISOString().split('T')[0]
            : undefined,
        };
        this.loadUsers(filter);
      });
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
    return permissions.map((permission) =>
      this.transloco.translate(`user.permissions.${permission}.title`)
    );
  }

  getWardLabel(wardNumber: number | null): string {
    if (wardNumber === null)
      return this.transloco.translate('user.municipality');
    return `${this.transloco.translate('user.ward')} ${wardNumber}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
