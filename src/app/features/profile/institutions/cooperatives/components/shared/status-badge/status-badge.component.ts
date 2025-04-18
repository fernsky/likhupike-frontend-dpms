import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';

import { CooperativeStatus } from '../../../types';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class StatusBadgeComponent implements OnInit, OnChanges {
  @Input() status: CooperativeStatus | null = null;
  @Input() showText = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  statusColor = '';
  statusIcon = '';
  statusDescription = '';

  ngOnInit(): void {
    this.updateStatusDisplay();
  }

  ngOnChanges(): void {
    this.updateStatusDisplay();
  }

  private updateStatusDisplay(): void {
    if (!this.status) {
      this.statusColor = 'default';
      this.statusIcon = 'help_outline';
      this.statusDescription = 'cooperative.statusDescriptions.unknown';
      return;
    }

    switch (this.status) {
      case CooperativeStatus.ACTIVE:
        this.statusColor = 'success';
        this.statusIcon = 'check_circle';
        this.statusDescription = 'cooperative.statusDescriptions.active';
        break;
      case CooperativeStatus.INACTIVE:
        this.statusColor = 'warn';
        this.statusIcon = 'cancel';
        this.statusDescription = 'cooperative.statusDescriptions.inactive';
        break;
      case CooperativeStatus.PENDING_APPROVAL:
        this.statusColor = 'warning';
        this.statusIcon = 'pending';
        this.statusDescription =
          'cooperative.statusDescriptions.pendingApproval';
        break;
      case CooperativeStatus.UNDER_REVIEW:
        this.statusColor = 'info';
        this.statusIcon = 'rate_review';
        this.statusDescription = 'cooperative.statusDescriptions.underReview';
        break;
      case CooperativeStatus.DISSOLVED:
        this.statusColor = 'danger';
        this.statusIcon = 'delete';
        this.statusDescription = 'cooperative.statusDescriptions.dissolved';
        break;
      case CooperativeStatus.MERGED:
        this.statusColor = 'primary';
        this.statusIcon = 'merge_type';
        this.statusDescription = 'cooperative.statusDescriptions.merged';
        break;
      default:
        this.statusColor = 'default';
        this.statusIcon = 'help_outline';
        this.statusDescription = 'cooperative.statusDescriptions.unknown';
    }
  }
}
