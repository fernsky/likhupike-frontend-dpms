/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CitizenStatusChipComponent } from '@app/features/citizen/components/citizen-status-chip/citizen-status-chip.component';
import {
  CitizenSummaryResponse,
  CitizenState,
  DocumentState,
} from '../../../../types';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-citizen-table',
  templateUrl: './citizen-table.component.html',
  styleUrls: ['./citizen-table.component.scss'],
  imports: [
    CitizenStatusChipComponent,
    TranslocoModule,
    MatIconModule,
    CommonModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTableModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-list',
      alias: 'citizen',
    }),
  ],
})
export class CitizenTableComponent implements OnChanges {
  @Input() citizens: CitizenSummaryResponse[] | null = [];
  @Input() totalItems: number | null = 0;
  @Input() currentPage: number | null = 1;
  @Input() pageSize: number | null = 10;

  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();
  @Output() viewCitizen = new EventEmitter<CitizenSummaryResponse>();
  @Output() editCitizen = new EventEmitter<CitizenSummaryResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<CitizenSummaryResponse> =
    new MatTableDataSource<CitizenSummaryResponse>([]);

  displayedColumns: string[] = [
    'name',
    'citizenshipNumber',
    'email',
    'phoneNumber',
    'state',
    'isApproved',
    'documentsStatus',
    'createdAt',
    'actions',
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['citizens'] && this.citizens) {
      this.dataSource.data = this.citizens;
    }
  }

  onPageChange(event: any): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex + 1, // Convert to 1-indexed for API
      pageSize: event.pageSize,
    });
  }

  onView(citizen: CitizenSummaryResponse): void {
    this.viewCitizen.emit(citizen);
  }

  onEdit(citizen: CitizenSummaryResponse): void {
    this.editCitizen.emit(citizen);
  }

  getStateClass(state: CitizenState | null | undefined): string {
    if (!state) return 'unknown';

    switch (state) {
      case CitizenState.APPROVED:
        return 'approved';
      case CitizenState.PENDING_REGISTRATION:
        return 'pending';
      case CitizenState.UNDER_REVIEW:
        return 'under-review';
      case CitizenState.ACTION_REQUIRED:
        return 'action-required';
      case CitizenState.REJECTED:
        return 'rejected';
      default:
        return 'unknown';
    }
  }

  getDocumentStatusClass(state: DocumentState | null | undefined): string {
    if (!state) return 'not-uploaded';

    switch (state) {
      case DocumentState.APPROVED:
        return 'approved';
      case DocumentState.AWAITING_REVIEW:
        return 'awaiting';
      case DocumentState.NOT_UPLOADED:
        return 'not-uploaded';
      case DocumentState.REJECTED_BLURRY:
      case DocumentState.REJECTED_INCONSISTENT:
      case DocumentState.REJECTED_MISMATCH:
      case DocumentState.REJECTED_UNSUITABLE:
        return 'rejected';
      default:
        return 'not-uploaded';
    }
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }
}
