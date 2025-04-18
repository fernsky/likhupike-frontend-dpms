import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CooperativeResponse } from '../../../types';
import { CooperativeActions } from '../../../store/actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-cooperative-grid-view',
  templateUrl: './cooperative-grid-view.component.html',
  styleUrls: ['./cooperative-grid-view.component.scss']
})
export class CooperativeGridViewComponent implements OnChanges {
  @Input() cooperatives: CooperativeResponse[] | null = [];
  @Input() loading = false;
  
  displayedCooperatives: CooperativeResponse[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperatives'] && this.cooperatives) {
      this.displayedCooperatives = this.cooperatives;
    }
  }

  viewCooperative(cooperative: CooperativeResponse): void {
    this.router.navigate(['/cooperatives', cooperative.id]);
  }

  editCooperative(cooperative: CooperativeResponse, event: Event): void {
    event.stopPropagation();
    this.store.dispatch(CooperativeActions.selectCooperative({ id: cooperative.id }));
    this.router.navigate(['/cooperatives/edit', cooperative.id]);
  }
  
  deleteCooperative(cooperative: CooperativeResponse, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('cooperative.dialogs.deleteTitle'),
        message: this.transloco.translate('cooperative.dialogs.deleteMessage', { 
          name: this.getCooperativeName(cooperative) 
        }),
        confirmButton: this.transloco.translate('common.actions.delete'),
        cancelButton: this.transloco.translate('common.actions.cancel'),
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(CooperativeActions.deleteCooperative({ id: cooperative.id }));
      }
    });
  }
  
  getPrimaryImageUrl(cooperative: CooperativeResponse): string {
    // Check if there's any primary media
    const primaryMedia = cooperative.primaryMedia;
    if (!primaryMedia) return 'assets/images/cooperative-placeholder.jpg';
    
    // Try to find primary image in this order: LOGO, HERO_IMAGE, GALLERY_IMAGE
    for (const mediaType of ['LOGO', 'HERO_IMAGE', 'GALLERY_IMAGE']) {
      if (primaryMedia[mediaType] && primaryMedia[mediaType].thumbnailUrl) {
        return primaryMedia[mediaType].thumbnailUrl;
      } else if (primaryMedia[mediaType] && primaryMedia[mediaType].fileUrl) {
        return primaryMedia[mediaType].fileUrl;
      }
    }
    
    return 'assets/images/cooperative-placeholder.jpg';
  }
  
  getCooperativeName(cooperative: CooperativeResponse): string {
    if (!cooperative.translations || cooperative.translations.length === 0) {
      return 'Unnamed Cooperative';
    }
    
    // First try to find translation in default locale
    const defaultTranslation = cooperative.translations.find(
      t => t.locale === cooperative.defaultLocale
    );
    
    if (defaultTranslation) {
      return defaultTranslation.name;
    }
    
    // Fall back to first available translation
    return cooperative.translations[0].name;
  }
  
  getCooperativeDescription(cooperative: CooperativeResponse): string {
    if (!cooperative.translations || cooperative.translations.length === 0) {
      return '';
    }
    
    // First try to find translation in default locale
    const defaultTranslation = cooperative.translations.find(
      t => t.locale === cooperative.defaultLocale
    );
    
    if (defaultTranslation && defaultTranslation.description) {
      return this.truncateDescription(defaultTranslation.description);
    }
    
    // Fall back to first available translation with description
    const translationWithDesc = cooperative.translations.find(t => t.description);
    return translationWithDesc ? this.truncateDescription(translationWithDesc.description || '') : '';
  }
  
  private truncateDescription(description: string): string {
    return description.length > 120 ? description.substring(0, 120) + '...' : description;
  }
}
