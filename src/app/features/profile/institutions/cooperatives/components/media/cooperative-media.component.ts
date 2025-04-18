import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CooperativeMediaActions } from '../../store/actions';
import * as fromCooperatives from '../../store/selectors';
import { 
  CooperativeMediaResponse, 
  CooperativeMediaType,
  MediaVisibilityStatus
} from '../../types';
import { MediaUploadDialogComponent } from '../dialogs/media-upload-dialog/media-upload-dialog.component';
import { MediaViewDialogComponent } from '../dialogs/media-view-dialog/media-view-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cooperative-media',
  templateUrl: './cooperative-media.component.html',
  styleUrls: ['./cooperative-media.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    TranslocoModule
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative'
    })
  ]
})
export class CooperativeMediaComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cooperativeId!: string;

  mediaItems$: Observable<CooperativeMediaResponse[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  
  mediaTypes = Object.values(CooperativeMediaType);
  selectedMediaType: CooperativeMediaType | null = null;
  
  visibilityOptions = Object.values(MediaVisibilityStatus);
  
  displayModes: string[] = ['grid', 'list'];
  currentDisplayMode = 'grid';
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {
    this.mediaItems$ = this.store.select(fromCooperatives.selectAllMedia);
    this.loading$ = this.store.select(fromCooperatives.selectMediaLoading);
    this.totalItems$ = this.store.select(fromCooperatives.selectMediaTotalItems);
    this.currentPage$ = this.store.select(fromCooperatives.selectMediaCurrentPage);
    this.pageSize$ = this.store.select(fromCooperatives.selectMediaPageSize);
  }

  ngOnInit(): void {
    if (this.cooperativeId) {
      this.loadMedia();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperativeId'] && this.cooperativeId) {
      this.loadMedia();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMedia(page = 0, size = 10): void {
    if (this.selectedMediaType) {
      this.store.dispatch(CooperativeMediaActions.loadMediaByType({
        cooperativeId: this.cooperativeId,
        mediaType: this.selectedMediaType,
        page,
        size
      }));
    } else {
      this.store.dispatch(CooperativeMediaActions.loadMedia({
        cooperativeId: this.cooperativeId,
        page,
        size
      }));
    }
  }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(MediaUploadDialogComponent, {
      width: '600px',
      data: {
        cooperativeId: this.cooperativeId,
        mediaTypes: this.mediaTypes
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          // Reload media after successful upload
          this.loadMedia();
        }
      });
  }

  openMediaViewDialog(media: CooperativeMediaResponse): void {
    this.dialog.open(MediaViewDialogComponent, {
      width: '800px',
      data: {
        media,
        cooperativeId: this.cooperativeId
      }
    });
  }

  confirmDeleteMedia(media: CooperativeMediaResponse, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('cooperative.dialogs.deleteMediaTitle'),
        message: this.transloco.translate('cooperative.dialogs.deleteMediaMessage', {
          title: media.title
        }),
        confirmButton: this.transloco.translate('common.actions.delete'),
        cancelButton: this.transloco.translate('common.actions.cancel')
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === true) {
          this.deleteMedia(media);
        }
      });
  }
  
  deleteMedia(media: CooperativeMediaResponse): void {
    this.store.dispatch(CooperativeMediaActions.deleteMedia({
      cooperativeId: this.cooperativeId,
      mediaId: media.id
    }));
  }
  
  setAsPrimary(media: CooperativeMediaResponse, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (media.isPrimary) {
      return;
    }
    
    this.store.dispatch(CooperativeMediaActions.setMediaAsPrimary({
      cooperativeId: this.cooperativeId,
      mediaId: media.id
    }));
  }
  
  updateVisibility(media: CooperativeMediaResponse, status: MediaVisibilityStatus): void {
    this.store.dispatch(CooperativeMediaActions.updateMediaVisibility({
      cooperativeId: this.cooperativeId,
      mediaId: media.id,
      status
    }));
  }

  filterByType(type: CooperativeMediaType | null): void {
    this.selectedMediaType = type;
    this.loadMedia();
  }

  onPageChange(event: PageEvent): void {
    this.loadMedia(event.pageIndex, event.pageSize);
  }

  changeDisplayMode(mode: string): void {
    this.currentDisplayMode = mode;
  }

  getMediaTypeLabel(type: CooperativeMediaType): string {
    return type.replace(/_/g, ' ').toLowerCase();
  }

  getMediaTypeIcon(type: CooperativeMediaType): string {
    switch (type) {
      case CooperativeMediaType.LOGO: return 'star';
      case CooperativeMediaType.HERO_IMAGE: return 'panorama';
      case CooperativeMediaType.GALLERY_IMAGE: return 'photo_library';
      case CooperativeMediaType.PRODUCT_PHOTO: return 'shopping_basket';
      case CooperativeMediaType.TEAM_PHOTO: return 'people';
      case CooperativeMediaType.DOCUMENT: return 'description';
      case CooperativeMediaType.VIDEO: return 'videocam';
      case CooperativeMediaType.BROCHURE: return 'book';
      case CooperativeMediaType.ANNUAL_REPORT: return 'assessment';
      case CooperativeMediaType.CERTIFICATE: return 'verified';
      default: return 'insert_drive_file';
    }
  }
}
