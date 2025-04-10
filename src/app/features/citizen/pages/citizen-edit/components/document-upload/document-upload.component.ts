import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { DocumentState, DocumentType } from '../../../../types';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-edit',
      alias: 'citizen',
    }),
  ],
})
export class DocumentUploadComponent {
  @Input() documentType!: DocumentType;
  @Input() documentState?: DocumentState | null;
  @Input() documentUrl?: string | null;
  @Input() uploadingDocument$!: Observable<boolean>;
  @Input() canUpload: boolean = true;
  @Input() accept: string = 'image/jpeg,image/png';
  @Input() label: string = '';
  @Input() note?: string | null;
  @Input() uploadedAt?: string | null;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() viewDocument = new EventEmitter<string>();

  documentTypeEnum = DocumentType;
  constructor() {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  onViewDocument(): void {
    if (this.documentUrl) {
      this.viewDocument.emit(this.documentUrl);
    }
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  getDocumentStateClass(): string {
    if (!this.documentState) return 'not-uploaded';

    switch (this.documentState) {
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

  getDocumentStateLabel(): string {
    if (!this.documentState) return 'Not Uploaded';

    switch (this.documentState) {
      case DocumentState.APPROVED:
        return 'Approved';
      case DocumentState.AWAITING_REVIEW:
        return 'Awaiting Review';
      case DocumentState.NOT_UPLOADED:
        return 'Not Uploaded';
      case DocumentState.REJECTED_BLURRY:
        return 'Rejected - Blurry';
      case DocumentState.REJECTED_INCONSISTENT:
        return 'Rejected - Inconsistent';
      case DocumentState.REJECTED_MISMATCH:
        return 'Rejected - Mismatch';
      case DocumentState.REJECTED_UNSUITABLE:
        return 'Rejected - Unsuitable';
      default:
        return 'Not Uploaded';
    }
  }
}
