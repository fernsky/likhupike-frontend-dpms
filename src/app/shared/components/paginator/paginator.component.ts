import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { NumberFormatService } from '@app/shared/services/number-format.service';

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    TranslocoModule,
  ],
})
export class PaginatorComponent implements OnChanges {
  @Input() totalElements = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showFirstLastButtons = true;
  @Input() disabled = false;

  @Output() pageChange = new EventEmitter<PageEvent>();

  // Track internal state
  private _pageSize = 10;
  private _pageIndex = 1;

  @Input() set pageSize(value: number) {
    if (this._pageSize !== value) {
      this._pageSize = value;
      this.updatePaginationState();
    }
  }
  get pageSize(): number {
    return this._pageSize;
  }

  @Input() set pageIndex(value: number) {
    if (this._pageIndex !== value) {
      this._pageIndex = value || 1;
      this._visiblePages = this.calculateVisiblePages();
    }
  }
  get pageIndex(): number {
    return this._pageIndex;
  }

  private _visiblePages: number[] = [];

  constructor(private numberFormat: NumberFormatService) {}

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get rangeStart(): number {
    return this.totalElements === 0
      ? 0
      : (this.pageIndex - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    const end = this.pageIndex * this.pageSize;
    return Math.min(end, this.totalElements);
  }

  get isFirstPage(): boolean {
    return this.pageIndex === 1;
  }

  get isLastPage(): boolean {
    return this.pageIndex >= this.totalPages;
  }

  formatNumber(value: number): string {
    return this.numberFormat.formatNumber(value);
  }

  onPageSizeChange(size: number): void {
    const newPageIndex =
      Math.floor(((this.pageIndex - 1) * this.pageSize) / size) + 1;
    this.emitPageEvent(newPageIndex, size);
  }

  goToPage(pageNumber: number): void {
    // Ensure we're working with valid page numbers
    if (
      pageNumber === this._pageIndex ||
      pageNumber < 1 ||
      pageNumber > this.totalPages
    ) {
      return;
    }

    this._pageIndex = pageNumber;
    this._visiblePages = this.calculateVisiblePages();
    this.emitPageEvent(pageNumber, this.pageSize);
  }

  private emitPageEvent(pageIndex: number, pageSize: number): void {
    this.pageChange.emit({ pageIndex, pageSize });
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit({
      ...event,
      pageIndex: event.pageIndex,
    });
  }

  // Update pagination logic
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['totalElements'] ||
      changes['pageSize'] ||
      changes['pageIndex']
    ) {
      this.updatePaginationState();
      this._visiblePages = this.calculateVisiblePages();
    }
  }

  private updatePaginationState(): void {
    const maxPage = Math.max(1, Math.ceil(this.totalElements / this.pageSize));
    if (this._pageIndex > maxPage && maxPage > 0) {
      this._pageIndex = maxPage;
      this._visiblePages = this.calculateVisiblePages();
      this.pageChange.emit({
        pageIndex: this._pageIndex,
        pageSize: this._pageSize,
      });
    } else if (this.totalElements === 0 && this._pageIndex > 1) {
      // Reset to page 1 if there are no elements but we're not on page 1
      this._pageIndex = 1;
      this._visiblePages = this.calculateVisiblePages();
      this.pageChange.emit({
        pageIndex: this._pageIndex,
        pageSize: this._pageSize,
      });
    }
  }

  getVisiblePages(): number[] {
    return this._visiblePages;
  }

  private calculateVisiblePages(): number[] {
    const totalPages = this.totalPages;
    if (totalPages <= 1) return [];

    const current = this._pageIndex;
    const delta = 1;
    const range = [];
    const rangeWithDots: number[] = [];
    let l: number | undefined;

    if (totalPages > 1) {
      range.push(1);
    }

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(totalPages, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (totalPages > 1 && range[range.length - 1] !== totalPages) {
      range.push(totalPages);
    }

    // Add dots and numbers
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1); // Represents dots
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }
}
