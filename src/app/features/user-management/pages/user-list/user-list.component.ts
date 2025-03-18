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

import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { UserResponse } from '../../models/user.interface';
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
  ],
})
export class UserListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'email',
    'wardNumber',
    'permissions',
    'status',
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
      search: [''],
      wardNumber: [null],
      permissions: [[]],
      active: [null],
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
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadUsers());
  }

  loadUsers(): void {
    const filter = {
      ...this.filterForm.value,
      pageSize: this.paginator?.pageSize || 10,
      pageIndex: this.paginator?.pageIndex || 0,
    };
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
    this.store.dispatch(
      UserActions.setActiveStatus({
        id: user.id,
        active: !user.active,
      })
    );
  }

  getPermissionLabels(permissions: {
    [key in PermissionType]: boolean;
  }): string[] {
    return (
      Object.entries(permissions)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, enabled]) => enabled)
        .map(([permission]) =>
          this.transloco.translate(`user.permissions.${permission}`)
        )
    );
  }

  getWardLabel(wardNumber: number | undefined): string {
    if (!wardNumber) return this.transloco.translate('user.municipality');
    return `${this.transloco.translate('user.ward')} ${wardNumber}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
