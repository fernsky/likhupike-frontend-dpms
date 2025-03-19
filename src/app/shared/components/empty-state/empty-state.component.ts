import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <button
        *ngIf="actionLabel"
        mat-raised-button
        color="primary"
        (click)="actionClick.emit()"
      >
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        text-align: center;
        color: var(--text-secondary);

        .empty-icon {
          font-size: 4rem;
          width: 4rem;
          height: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        p {
          margin: 0.5rem 0 1.5rem;
        }

        button {
          min-width: 200px;
        }
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() icon = 'sentiment_dissatisfied';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel = '';
  @Output() actionClick = new EventEmitter<void>();
}
