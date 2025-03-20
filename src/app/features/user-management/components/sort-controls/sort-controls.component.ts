import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class SortControlsComponent {
  @Input() sortOptions: SortOption[] = [
    { value: 'email', label: 'user.list.columns.email' },
    { value: 'createdAt', label: 'user.list.sort.createdAt' },
    { value: 'updatedAt', label: 'user.list.sort.updatedAt' },
  ];

  @Input() currentSort = 'createdAt';
  @Input() currentDirection: 'ASC' | 'DESC' = 'DESC';

  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    direction: 'ASC' | 'DESC';
  }>();

  sortControl = new FormControl(this.currentSort);

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
}
