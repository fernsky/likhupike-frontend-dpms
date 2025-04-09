import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { DocumentState } from '../../types';

@Component({
  selector: 'app-document-status-chip',
  templateUrl: './document-status-chip.component.html',
  styleUrls: ['./document-status-chip.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class DocumentStatusChipComponent {
  @Input() state: DocumentState | null | undefined;

  getStatusClass(): string {
    if (!this.state) return 'not-uploaded';

    switch (this.state) {
      case DocumentState.APPROVED:
        return 'approved';
      case DocumentState.AWAITING_REVIEW:
        return 'awaiting';
      case DocumentState.NOT_UPLOADED:
        return 'not-uploaded';
      case DocumentState.REJECTED_BLURRY:
      case DocumentState.REJECTED_INCONSISTENT:
      case DocumentState.REJECTED_MISMATCH:
      case DocumentState.REJECTED_UNSUITABLE:
        return 'rejected';
      default:
        return 'not-uploaded';
    }
  }

  getStatusIcon(): string {
    if (!this.state) return 'file_upload_off';

    switch (this.state) {
      case DocumentState.APPROVED:
        return 'check_circle';
      case DocumentState.AWAITING_REVIEW:
        return 'pending';
      case DocumentState.NOT_UPLOADED:
        return 'file_upload_off';
      case DocumentState.REJECTED_BLURRY:
        return 'blur_on';
      case DocumentState.REJECTED_INCONSISTENT:
      case DocumentState.REJECTED_MISMATCH:
        return 'gpp_bad';
      case DocumentState.REJECTED_UNSUITABLE:
        return 'block';
      default:
        return 'file_upload_off';
    }
  }

  getRejectionReason(): string {
    if (!this.state) return '';

    switch (this.state) {
      case DocumentState.REJECTED_BLURRY:
        return 'document.rejection.blurry';
      case DocumentState.REJECTED_INCONSISTENT:
        return 'document.rejection.inconsistent';
      case DocumentState.REJECTED_MISMATCH:
        return 'document.rejection.mismatch';
      case DocumentState.REJECTED_UNSUITABLE:
        return 'document.rejection.unsuitable';
      default:
        return '';
    }
  }
}
