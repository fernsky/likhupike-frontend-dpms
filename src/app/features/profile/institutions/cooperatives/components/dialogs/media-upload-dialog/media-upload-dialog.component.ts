import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { 
  CooperativeMediaType, 
  CreateCooperativeMediaDto, 
  MediaVisibilityStatus 
} from '../../../types';
import { CooperativeMediaActions } from '../../../store/actions';
import * as fromCooperatives from '../../../store/selectors';

interface MediaUploadDialogData {
  cooperativeId: string;
  mediaTypes: CooperativeMediaType[];
}

@Component({
  selector: 'app-media-upload-dialog',
  templateUrl: './media-upload-dialog.component.html',
  styleUrls: ['./media-upload-dialog.component.scss']
})
export class MediaUploadDialogComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isImage = false;
  isVideo = false;
  isPdf = false;
  
  mediaTypes: CooperativeMediaType[] = [];
  visibilityOptions = Object.values(MediaVisibilityStatus);
  
  uploading = false;
  uploadProgress = 0;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private store: Store,
    public dialogRef: MatDialogRef<MediaUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MediaUploadDialogData
  ) {
    this.mediaTypes = data.mediaTypes || Object.values(CooperativeMediaType);
  }

  ngOnInit(): void {
    this.initForm();
    
    // Subscribe to upload status/progress
    this.store.select(fromCooperatives.selectMediaUploading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(uploading => {
        this.uploading = uploading;
      });
      
    this.store.select(fromCooperatives.selectMediaUploadProgress)
      .pipe(takeUntil(this.destroy$))
      .subscribe(progress => {
        this.uploadProgress = progress;
      });
      
    this.store.select(fromCooperatives.selectMediaUploadSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.dialogRef.close(true);
          this.store.dispatch(CooperativeMediaActions.resetUploadStatus());
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initForm(): void {
    this.uploadForm = this.fb.group({
      type: [CooperativeMediaType.GALLERY_IMAGE, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      altText: [''],
      tags: [''],
      license: [''],
      attribution: [''],
      visibilityStatus: [MediaVisibilityStatus.PUBLIC],
      isPrimary: [false],
      isFeatured: [false],
      locale: ['']
    });
    
    // Auto-populate alt text with title for accessibility
    this.uploadForm.get('title')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(title => {
        if (!this.uploadForm.get('altText')?.value) {
          this.uploadForm.get('altText')?.setValue(title);
        }
      });
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.createFilePreview();
      
      // Set media type based on file type
      this.detectAndSetMediaType();
    }
  }
  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  createFilePreview(): void {
    this.isImage = this.isVideo = this.isPdf = false;
    
    if (!this.selectedFile) {
      return;
    }
    
    // Check file type
    if (this.selectedFile.type.startsWith('image/')) {
      this.isImage = true;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } 
    else if (this.selectedFile.type.startsWith('video/')) {
      this.isVideo = true;
      
      const videoUrl = URL.createObjectURL(this.selectedFile);
      this.previewUrl = videoUrl;
    } 
    else if (this.selectedFile.type === 'application/pdf') {
      this.isPdf = true;
      
      // For PDFs, we could generate a thumbnail or just show an icon
      this.previewUrl = null;
    } 
    else {
      // For other file types, no preview
      this.previewUrl = null;
    }
  }
  
  detectAndSetMediaType(): void {
    if (!this.selectedFile) {
      return;
    }
    
    if (this.selectedFile.type.startsWith('image/')) {
      this.uploadForm.get('type')?.setValue(CooperativeMediaType.GALLERY_IMAGE);
    } 
    else if (this.selectedFile.type.startsWith('video/')) {
      this.uploadForm.get('type')?.setValue(CooperativeMediaType.VIDEO);
    } 
    else if (this.selectedFile.type === 'application/pdf') {
      this.uploadForm.get('type')?.setValue(CooperativeMediaType.DOCUMENT);
    } 
    else {
      this.uploadForm.get('type')?.setValue(CooperativeMediaType.DOCUMENT);
    }
  }
  
  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) {
      return;
    }
    
    const metadata: CreateCooperativeMediaDto = {
      ...this.uploadForm.value
    };
    
    // Only include locale if it's set
    if (!metadata.locale) {
      delete metadata.locale;
    }
    
    this.store.dispatch(CooperativeMediaActions.uploadMedia({
      cooperativeId: this.data.cooperativeId,
      file: this.selectedFile,
      metadata
    }));
  }
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
  
  getFileSize(): string {
    if (!this.selectedFile) {
      return '';
    }
    
    const bytes = this.selectedFile.size;
    
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / 1048576).toFixed(1) + ' MB';
    }
  }
}
