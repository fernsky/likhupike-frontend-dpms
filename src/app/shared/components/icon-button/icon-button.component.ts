import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type IconButtonColor = 'primary' | 'accent' | 'warn' | 'default';
export type IconButtonType = 'raised' | 'stroked' | 'flat';
export type IconButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class IconButtonComponent {
  @Input() icon = '';
  @Input() color: IconButtonColor = 'primary';
  @Input() buttonType: IconButtonType = 'stroked';
  @Input() size: IconButtonSize = 'medium';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() tooltipText = '';
  @Input() tooltipPosition: 'above' | 'below' | 'left' | 'right' = 'above';
  @Input() ariaLabel = '';

  @Output() clicked = new EventEmitter<void>();

  get buttonClass(): string {
    return this.buttonType === 'raised'
      ? 'mat-raised-button'
      : this.buttonType === 'stroked'
        ? 'mat-stroked-button'
        : 'mat-flat-button';
  }

  get colorClass(): string {
    return this.color !== 'default' ? `mat-${this.color}` : '';
  }

  get sizeClass(): string {
    return this.size;
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
