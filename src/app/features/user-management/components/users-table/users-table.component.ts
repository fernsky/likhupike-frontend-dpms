import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
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
    EmptyStateComponent, // Add EmptyStateComponent to imports
    MatTooltipModule,
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
export class UsersTableComponent implements AfterViewInit {
  @Input() dataSource!: MatTableDataSource<UserResponse>;
  @Input() loading = false;
  @Input() totalUsers = 0;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<UserResponse>();
  @Output() toggleStatus = new EventEmitter<UserResponse>();
  @Output() pageChange = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = [
    'email',
    'ward',
    'permissions',
    'approvalStatus',
    'actions',
  ];

  constructor(
    private numberFormat: NumberFormatService,
    private transloco: TranslocoService
  ) {}

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
}
