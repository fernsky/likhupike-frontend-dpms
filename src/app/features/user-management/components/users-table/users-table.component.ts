/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  SimpleChange,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { UserResponse } from '../../models/user.interface';
import { animate, style, transition, trigger } from '@angular/animations';
import { NumberFormatService } from '@app/shared/services/number-format.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermissionType } from '@app/core/models/permission.enum';
import {
  PaginatorComponent,
  PageEvent,
} from '@shared/components/paginator/paginator.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TranslocoModule,
    EmptyStateComponent,
    MatTooltipModule,
    PaginatorComponent,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class UsersTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() set dataSource(value: MatTableDataSource<UserResponse>) {
    if (value) {
      this._dataSource = value;
      this._dataSource.paginator = this.paginator;
      this._dataSource.sort = this.sort;
    }
  }
  get dataSource(): MatTableDataSource<UserResponse> {
    return this._dataSource;
  }
  private _dataSource = new MatTableDataSource<UserResponse>();

  @Input() loading = false;
  @Input() totalUsers = 0;
  @Input() pageSize = 10;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<UserResponse>();
  @Output() toggleStatus = new EventEmitter<UserResponse>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  @Input() set pageIndex(value: number) {
    if (value !== undefined && this._currentPageIndex !== value) {
      this._currentPageIndex = value;
      if (this.customPaginator) {
        this.customPaginator.pageIndex = value;
        // Force update of paginator
        this.customPaginator.ngOnChanges({
          pageIndex: new SimpleChange(null, value, false),
        });
      }
    }
  }
  get pageIndex(): number {
    return this._currentPageIndex;
  }

  private _currentPageIndex = 1;

  // Add direct reference to our custom paginator component
  @ViewChild(PaginatorComponent) customPaginator!: PaginatorComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() hasError = false;

  @Input() set users(value: UserResponse[] | null) {
    if (value) {
      this._dataSource.data = value;
    } else {
      this._dataSource.data = [];
    }
  }

  displayedColumns = [
    'email',
    'ward',
    'permissions',
    'approvalStatus',
    'actions',
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private numberFormat: NumberFormatService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this._dataSource) {
      this._dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    if (this._dataSource) {
      this._dataSource.paginator = this.paginator;
      this._dataSource.sort = this.sort;
    }
  }

  getWardLabel(wardNumber: number | null): string {
    if (wardNumber === null) {
      return this.transloco.translate('user.list.filters.ward.municipality');
    }

    return this.transloco.translate('user.list.filters.ward.prefix', {
      number: this.numberFormat.formatNumber(wardNumber),
    });
  }

  getPermissionsList(permissions: PermissionType[]): string {
    return permissions
      .slice(2)
      .map((perm) => this.transloco.translate(`user.permissions.${perm}.title`))
      .join('\n');
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  getData(): UserResponse[] {
    return this._dataSource.data;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, item: UserResponse): string {
    return item.id;
  }
}
