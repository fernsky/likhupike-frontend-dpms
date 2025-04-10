import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  provideTranslocoScope,
  TranslocoService,
  TranslocoModule,
} from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CitizenFacade } from '../../../../store/citizen.facade';
import {
  CitizenResponse,
  DocumentState,
  DocumentType,
} from '../../../../types';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';

@Component({
  selector: 'app-documents-tab',
  templateUrl: './documents-tab.component.html',
  styleUrls: ['./documents-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoModule, DocumentUploadComponent],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-edit',
      alias: 'citizen',
    }),
  ],
})
export class DocumentsTabComponent {
  @Input() citizen!: CitizenResponse;

  // Make DocumentType available to template
  DocumentType = DocumentType;

  uploadingPhoto$: Observable<boolean>;
  uploadingCitizenshipFront$: Observable<boolean>;
  uploadingCitizenshipBack$: Observable<boolean>;

  constructor(
    private citizenFacade: CitizenFacade,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {
    this.uploadingPhoto$ = this.citizenFacade.isUploadingDocument(
      DocumentType.CITIZEN_PHOTO
    );
    this.uploadingCitizenshipFront$ = this.citizenFacade.isUploadingDocument(
      DocumentType.CITIZENSHIP_FRONT
    );
    this.uploadingCitizenshipBack$ = this.citizenFacade.isUploadingDocument(
      DocumentType.CITIZENSHIP_BACK
    );
  }

  documentStateToLabel(state: DocumentState | null | undefined): string {
    if (!state)
      return this.transloco.translate('citizen.documentStates.NOT_UPLOADED');
    return this.transloco.translate(`citizen.documentStates.${state}`);
  }

  documentStateToClass(state: DocumentState | null | undefined): string {
    if (!state) return 'not-uploaded';

    switch (state) {
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

  canUpload(state: DocumentState | null | undefined): boolean {
    return (
      !state ||
      state === DocumentState.NOT_UPLOADED ||
      state === DocumentState.REJECTED_BLURRY ||
      state === DocumentState.REJECTED_INCONSISTENT ||
      state === DocumentState.REJECTED_MISMATCH ||
      state === DocumentState.REJECTED_UNSUITABLE
    );
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  openDocument(url: string | null | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onPhotoSelected(file: File): void {
    if (file) {
      this.uploadDocument(DocumentType.CITIZEN_PHOTO, file);
    }
  }

  onCitizenshipFrontSelected(file: File): void {
    if (file) {
      this.uploadDocument(DocumentType.CITIZENSHIP_FRONT, file);
    }
  }

  onCitizenshipBackSelected(file: File): void {
    if (file) {
      this.uploadDocument(DocumentType.CITIZENSHIP_BACK, file);
    }
  }

  private uploadDocument(documentType: DocumentType, file: File): void {
    // Validate file
    if (!this.validateFile(file, documentType)) {
      return;
    }

    // Check if already uploaded and ask for confirmation
    const documentState = this.getDocumentState(documentType);
    if (documentState) {
      this.confirmReplaceDocument(documentType, file);
    } else {
      // Upload directly if not uploaded yet
      this.doUpload(documentType, file);
    }
  }

  private validateFile(file: File, documentType: DocumentType): boolean {
    // Check file size
    const maxSizeMB = documentType === DocumentType.CITIZEN_PHOTO ? 5 : 10; // 5MB for photo, 10MB for documents
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      this.snackBar.open(
        this.transloco.translate('citizen.documents.fileTooLarge', {
          size: maxSizeMB,
        }),
        this.transloco.translate('common.actions.close'),
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      return false;
    }

    // Check file type
    const allowedTypes =
      documentType === DocumentType.CITIZEN_PHOTO
        ? ['image/jpeg', 'image/png']
        : ['image/jpeg', 'image/png', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      this.snackBar.open(
        this.transloco.translate('citizen.documents.invalidFileType'),
        this.transloco.translate('common.actions.close'),
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      return false;
    }

    return true;
  }

  private confirmReplaceDocument(documentType: DocumentType, file: File): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.transloco.translate('citizen.documents.replace.title'),
        message: this.transloco.translate('citizen.documents.replace.message'),
        confirmButton: this.transloco.translate(
          'citizen.documents.replace.confirmButton'
        ),
        cancelButton: this.transloco.translate('common.actions.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.doUpload(documentType, file);
      }
    });
  }

  private doUpload(documentType: DocumentType, file: File): void {
    this.citizenFacade.uploadDocument(this.citizen.id, documentType, file);
  }

  private getDocumentState(
    documentType: DocumentType
  ): DocumentState | null | undefined {
    switch (documentType) {
      case DocumentType.CITIZEN_PHOTO:
        return this.citizen.documents.photo?.state;
      case DocumentType.CITIZENSHIP_FRONT:
        return this.citizen.documents.citizenshipFront?.state;
      case DocumentType.CITIZENSHIP_BACK:
        return this.citizen.documents.citizenshipBack?.state;
      default:
        return null;
    }
  }
}
