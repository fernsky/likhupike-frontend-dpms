import { Component, Input, OnInit } from '@angular/core';
import { CooperativeStatus } from '../../../types';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent implements OnInit {
  @Input() status: CooperativeStatus | null = null;
  
  statusColor = '';
  statusIcon = '';

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
      return;
    }

    switch (this.status) {
      case CooperativeStatus.ACTIVE:
        this.statusColor = 'primary';
        this.statusIcon = 'check_circle';
        break;
      case CooperativeStatus.INACTIVE:
        this.statusColor = 'warn';
        this.statusIcon = 'cancel';
        break;
      case CooperativeStatus.PENDING_APPROVAL:
        this.statusColor = 'accent';
        this.statusIcon = 'pending';
        break;
      case CooperativeStatus.UNDER_REVIEW:
        this.statusColor = 'accent';
        this.statusIcon = 'rate_review';
        break;
      case CooperativeStatus.DISSOLVED:
        this.statusColor = 'warn';
        this.statusIcon = 'delete';
        break;
      case CooperativeStatus.MERGED:
        this.statusColor = 'primary';
        this.statusIcon = 'merge_type';
        break;
      default:
        this.statusColor = 'default';
        this.statusIcon = 'help_outline';
    }
  }
}
