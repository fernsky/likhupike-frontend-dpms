import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import {
  CooperativeMediaResponse,
  MediaVisibilityStatus,
  UpdateCooperativeMediaDto,
} from '../../../types';
import { CooperativeMediaActions } from '../../../store/actions';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

interface MediaViewDialogData {
  media: CooperativeMediaResponse;
  cooperativeId: string;
}

@Component({
  selector: 'app-media-view-dialog',
  templateUrl: './media-view-dialog.component.html',
  styleUrls: ['./media-view-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class MediaViewDialogComponent implements OnInit {
  mediaForm!: FormGroup;
  editMode = false;
  visibilityOptions = Object.values(MediaVisibilityStatus);

  isImage = false;
  isVideo = false;
  isPdf = false;
  isDocument = false;

  mediaUrl: string | null = null;
  loading = false;
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public dialogRef: MatDialogRef<MediaViewDialogComponent>,
    public dialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MediaViewDialogData
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.detectMediaType();
    this.parseMediaUrl();
    this.parseTags();
  }

  private initForm(): void {
    const media = this.data.media;

    this.mediaForm = this.fb.group({
      title: [media.title],
      description: [media.description || ''],
      altText: [media.altText || ''],
      tags: [media.tags || ''],
      license: [media.license || ''],
      attribution: [media.attribution || ''],
      visibilityStatus: [media.visibilityStatus],
      isPrimary: [media.isPrimary],
      isFeatured: [media.isFeatured],
    });

    // Disable form initially (view mode)
    this.mediaForm.disable();
  }

  private detectMediaType(): void {
    const mimeType = this.data.media.mimeType;

    if (mimeType?.startsWith('image/')) {
      this.isImage = true;
    } else if (mimeType?.startsWith('video/')) {
      this.isVideo = true;
    } else if (mimeType === 'application/pdf') {
      this.isPdf = true;
    } else if (
      mimeType?.startsWith('application/') ||
      mimeType?.startsWith('text/')
    ) {
      this.isDocument = true;
    }
  }

  private parseMediaUrl(): void {
    this.mediaUrl = this.data.media.fileUrl || null;
  }

  private parseTags(): void {
    if (this.data.media.tags) {
      this.tags = this.data.media.tags.split(',').map((tag) => tag.trim());
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.mediaForm.enable();
    } else {
      this.mediaForm.disable();
      // Reset form values when canceling edit
      this.initForm();
    }
  }

  saveChanges(): void {
    if (this.mediaForm.invalid) {
      return;
    }

    const formValue = this.mediaForm.value;
    const metadata: UpdateCooperativeMediaDto = {
      title: formValue.title,
      description: formValue.description || undefined,
      altText: formValue.altText || undefined,
      tags: formValue.tags || undefined,
      license: formValue.license || undefined,
      attribution: formValue.attribution || undefined,
      visibilityStatus: formValue.visibilityStatus,
      isPrimary: formValue.isPrimary,
      isFeatured: formValue.isFeatured,
    };

    this.store.dispatch(
      CooperativeMediaActions.updateMediaMetadata({
        cooperativeId: this.data.cooperativeId,
        mediaId: this.data.media.id,
        metadata,
      })
    );

    this.editMode = false;
    this.mediaForm.disable();
  }

  confirmDeleteMedia(): void {
    this.dialogRef.close({ action: 'delete', mediaId: this.data.media.id });
  }

  setAsPrimary(): void {
    if (this.data.media.isPrimary) {
      return;
    }

    this.store.dispatch(
      CooperativeMediaActions.setMediaAsPrimary({
        cooperativeId: this.data.cooperativeId,
        mediaId: this.data.media.id,
      })
    );

    this.dialogRef.close({ action: 'setPrimary', mediaId: this.data.media.id });
  }

  updateVisibility(status: MediaVisibilityStatus): void {
    this.store.dispatch(
      CooperativeMediaActions.updateMediaVisibility({
        cooperativeId: this.data.cooperativeId,
        mediaId: this.data.media.id,
        status,
      })
    );

    this.dialogRef.close({
      action: 'updateVisibility',
      mediaId: this.data.media.id,
      status,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getVisibilityLabel(status: MediaVisibilityStatus): string {
    return status.replace(/_/g, ' ').toLowerCase();
  }

  getMediaTypeLabel(): string {
    return this.data.media.type.replace(/_/g, ' ').toLowerCase();
  }

  getFormattedDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  getFileSize(): string {
    const bytes = this.data.media.fileSize || 0;

    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / 1048576).toFixed(1) + ' MB';
    }
  }

  downloadMedia(): void {
    if (this.mediaUrl) {
      const link = document.createElement('a');
      link.href = this.mediaUrl;
      link.download = this.data.media.fileUrl || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
