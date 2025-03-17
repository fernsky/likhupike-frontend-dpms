import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, TranslocoPipe],
  template: `
    <div class="loading-overlay" [class.visible]="isLoading">
      <div class="loading-content">
        <mat-spinner diameter="40"></mat-spinner>
        <span class="loading-text">{{
          message || (defaultMessage | transloco)
        }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 1000;
      }

      .loading-overlay.visible {
        opacity: 1;
        pointer-events: all;
      }

      .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .loading-text {
        color: rgba(0, 0, 0, 0.87);
        font-size: 0.875rem;
      }
    `,
  ],
})
export class LoadingOverlayComponent {
  @Input() isLoading = false;
  @Input() message?: string;
  readonly defaultMessage = 'common.loading';
}
