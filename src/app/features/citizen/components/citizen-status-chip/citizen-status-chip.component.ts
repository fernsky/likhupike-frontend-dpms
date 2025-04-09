import { Component, Input } from '@angular/core';
import { CitizenState } from '../../types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-citizen-status-chip',
  templateUrl: './citizen-status-chip.component.html',
  styleUrls: ['./citizen-status-chip.component.scss'],
  imports: [CommonModule, MatIconModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-list',
      alias: 'citizen',
    }),
  ],
})
export class CitizenStatusChipComponent {
  @Input() state: CitizenState | null | undefined;

  getStatusClass(): string {
    if (!this.state) return 'unknown';

    switch (this.state) {
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

  getStatusIcon(): string {
    if (!this.state) return 'help';

    switch (this.state) {
      case CitizenState.APPROVED:
        return 'check_circle';
      case CitizenState.PENDING_REGISTRATION:
        return 'pending';
      case CitizenState.UNDER_REVIEW:
        return 'rate_review';
      case CitizenState.ACTION_REQUIRED:
        return 'error';
      case CitizenState.REJECTED:
        return 'cancel';
      default:
        return 'help';
    }
  }
}
