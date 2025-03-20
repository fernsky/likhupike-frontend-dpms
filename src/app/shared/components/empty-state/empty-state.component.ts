import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslocoModule],
})
export class EmptyStateComponent {
  @Input() icon = 'sentiment_dissatisfied';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel = '';
  @Input() appearance: 'default' | 'integrated' = 'default';
  @Output() actionClick = new EventEmitter<void>();
}
