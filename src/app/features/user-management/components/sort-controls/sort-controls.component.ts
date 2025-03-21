import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-sort-controls',
  templateUrl: './sort-controls.component.html',
  styleUrls: ['./sort-controls.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
})
export class SortControlsComponent implements OnInit {
  @Input() sortOptions: SortOption[] = [
    { value: 'email', label: 'user.list.columns.email' },
    { value: 'createdAt', label: 'user.list.sort.createdAt' },
    { value: 'updatedAt', label: 'user.list.sort.updatedAt' },
  ];

  private _currentSort = 'createdAt';
  private _currentDirection: 'ASC' | 'DESC' = 'DESC';

  @Input()
  set currentSort(value: string) {
    if (value && this._currentSort !== value) {
      this._currentSort = value;
      this.sortControl.setValue(value, { emitEvent: false });
    }
  }
  get currentSort(): string {
    return this._currentSort;
  }

  @Input()
  set currentDirection(value: 'ASC' | 'DESC') {
    if (value && this._currentDirection !== value) {
      this._currentDirection = value;
    }
  }
  get currentDirection(): 'ASC' | 'DESC' {
    return this._currentDirection;
  }

  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    direction: 'ASC' | 'DESC';
  }>();

  sortControl = new FormControl(this._currentSort);

  toggleDirection() {
    this.currentDirection = this.currentDirection === 'ASC' ? 'DESC' : 'ASC';
    this.emitSortChange();
  }

  onSortChange(value: string) {
    this.currentSort = value;
    this.emitSortChange();
  }

  private emitSortChange() {
    this.sortChange.emit({
      sortBy: this.currentSort,
      direction: this.currentDirection,
    });
  }

  ngOnInit() {
    // Initialize with default values
    this.sortControl.setValue(this._currentSort);
  }
}
