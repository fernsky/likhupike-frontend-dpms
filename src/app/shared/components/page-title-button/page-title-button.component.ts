import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

export type PageTitleButtonVariant = 'primary' | 'secondary';
export type PageTitleButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-page-title-button',
  templateUrl: './page-title-button.component.html',
  styleUrls: ['./page-title-button.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslocoModule,
  ],
})
export class PageTitleButtonComponent {
  @Input() icon: string = '';
  @Input() fullText: string = '';
  @Input() mediumText?: string;
  @Input() variant: PageTitleButtonVariant = 'primary';
  @Input() size: PageTitleButtonSize = 'medium';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();
}
