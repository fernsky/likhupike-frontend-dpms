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
  private _pageIndex = 0;

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
      this._pageIndex = value;
      // Force update of visible pages when pageIndex changes
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
    return this.totalElements === 0 ? 0 : this.pageIndex * this.pageSize + 1;
  }

  get rangeEnd(): number {
    const end = (this.pageIndex + 1) * this.pageSize;
    return Math.min(end, this.totalElements);
  }

  get isFirstPage(): boolean {
    return this.pageIndex === 0;
  }

  get isLastPage(): boolean {
    return this.pageIndex === this.totalPages - 1;
  }

  formatNumber(value: number): string {
    return this.numberFormat.formatNumber(value);
  }

  onPageSizeChange(size: number): void {
    const newPageIndex = Math.floor((this.pageIndex * this.pageSize) / size);
    this.emitPageEvent(newPageIndex, size);
  }

  goToPage(index: number): void {
    if (index === this._pageIndex || index < 0 || index >= this.totalPages)
      return;
    this._pageIndex = index;
    this._visiblePages = this.calculateVisiblePages();
    this.emitPageEvent(index, this.pageSize);
  }

  private emitPageEvent(pageIndex: number, pageSize: number): void {
    this.pageChange.emit({ pageIndex, pageSize });
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
    // Ensure pageIndex is within bounds
    const maxPage = Math.max(
      0,
      Math.ceil(this.totalElements / this.pageSize) - 1
    );
    if (this._pageIndex > maxPage) {
      this._pageIndex = maxPage;
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

    // If there's only 1 page, return empty array (don't show page numbers)
    if (totalPages <= 1) {
      return [];
    }

    const current = this._pageIndex;
    const delta = 1;
    const range = [];
    const rangeWithDots: number[] = [];
    let l: number | undefined;

    // Only add first page if we have more than 1 page
    if (totalPages > 1) {
      range.push(0);
    }

    // Calculate range around current page
    for (
      let i = Math.max(1, current - delta);
      i < Math.min(totalPages - 1, current + delta + 1);
      i++
    ) {
      range.push(i);
    }

    // Only add last page if it's different from first page
    if (totalPages > 1 && totalPages - 1 !== range[range.length - 1]) {
      range.push(totalPages - 1);
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
