import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';

import { CooperativeActions, CooperativeMediaActions } from '../../store/actions';
import { CooperativeResponse, CooperativeMediaResponse, CooperativeMediaType } from '../../types';
import * as fromCooperatives from '../../store/selectors';

@Component({
  selector: 'app-cooperative-view-page',
  templateUrl: './cooperative-view-page.component.html',
  styleUrls: ['./cooperative-view-page.component.scss']
})
export class CooperativeViewPageComponent implements OnInit, OnDestroy {
  cooperative$: Observable<CooperativeResponse | null>;
  loading$: Observable<boolean>;
  galleryImages$: Observable<CooperativeMediaResponse[]>;
  currentLocale = 'en'; // Default locale
  
  // For tab navigation
  activeTab = 0;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.cooperative$ = this.store.select(fromCooperatives.selectSelectedCooperative);
    this.loading$ = this.store.select(fromCooperatives.selectCooperativesLoading);
    
    // Select gallery images for the cooperative
    this.galleryImages$ = this.store.select(fromCooperatives.selectSelectedCooperativeId).pipe(
      switchMap(id => {
        if (!id) return [];
        return this.store.select(fromCooperatives.selectCooperativeMediaByType(
          id, 
          CooperativeMediaType.GALLERY_IMAGE
        ));
      })
    );
  }

  ngOnInit(): void {
    // Get cooperative ID from route and load the cooperative
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      takeUntil(this.destroy$)
    ).subscribe(id => {
      if (id) {
        // Load data
        this.store.dispatch(CooperativeActions.loadCooperative({ id }));
        this.store.dispatch(CooperativeActions.selectCooperative({ id }));
        this.store.dispatch(CooperativeMediaActions.loadMedia({ 
          cooperativeId: id, 
          page: 0, 
          size: 100 // Load all media for public view
        }));
      }
    });
    
    // Subscribe to cooperative changes to update meta tags
    this.cooperative$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cooperative => {
      if (cooperative) {
        this.updateMetaTags(cooperative);
      }
    });
    
    // Get the locale from the query params
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const locale = params.get('locale');
      if (locale) {
        this.currentLocale = locale;
      }
    });
    
    // Handle tab changes from URL
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const tab = params.get('tab');
      if (tab) {
        this.activeTab = parseInt(tab, 10) || 0;
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onTabChange(index: number): void {
    this.activeTab = index;
    
    // Update URL to preserve tab state on page refresh
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge'
    });
  }
  
  getCooperativeName(cooperative: CooperativeResponse): string {
    if (!cooperative.translations || cooperative.translations.length === 0) {
      return 'Unnamed Cooperative';
    }
    
    // First try to find translation in the current locale
    let translation = cooperative.translations.find(t => t.locale === this.currentLocale);
    
    // If not found, try the default locale
    if (!translation) {
      translation = cooperative.translations.find(t => t.locale === cooperative.defaultLocale);
    }
    
    // If still not found, use the first available
    if (!translation) {
      translation = cooperative.translations[0];
    }
    
    return translation.name;
  }
  
  getTranslation(cooperative: CooperativeResponse): any {
    if (!cooperative.translations || cooperative.translations.length === 0) {
      return null;
    }
    
    // First try to find translation in the current locale
    let translation = cooperative.translations.find(t => t.locale === this.currentLocale);
    
    // If not found, try the default locale
    if (!translation) {
      translation = cooperative.translations.find(t => t.locale === cooperative.defaultLocale);
    }
    
    // If still not found, use the first available
    if (!translation) {
      translation = cooperative.translations[0];
    }
    
    return translation;
  }
  
  changeLocale(locale: string): void {
    this.currentLocale = locale;
    
    // Update URL to preserve locale on page refresh
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { locale },
      queryParamsHandling: 'merge'
    });
  }
  
  editCooperative(cooperative: CooperativeResponse): void {
    this.router.navigate(['/cooperatives/edit', cooperative.id]);
  }
  
  getHeaderImage(cooperative: CooperativeResponse): string {
    const primaryMedia = cooperative.primaryMedia;
    
    // Check for header image in this order: HERO_IMAGE, GALLERY_IMAGE, LOGO
    if (primaryMedia) {
      for (const type of [CooperativeMediaType.HERO_IMAGE, CooperativeMediaType.GALLERY_IMAGE, CooperativeMediaType.LOGO]) {
        if (primaryMedia[type] && primaryMedia[type].fileUrl) {
          return primaryMedia[type].fileUrl;
        }
      }
    }
    
    // Return default if no image found
    return 'assets/images/cooperative-hero-default.jpg';
  }
  
  getLogo(cooperative: CooperativeResponse): string | null {
    const primaryMedia = cooperative.primaryMedia;
    if (primaryMedia && primaryMedia[CooperativeMediaType.LOGO]?.fileUrl) {
      return primaryMedia[CooperativeMediaType.LOGO].fileUrl;
    }
    return null;
  }
  
  openGalleryView(image: CooperativeMediaResponse): void {
    this.dialog.open(MediaViewDialogComponent, {
      width: '100%',
      maxWidth: '1200px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'gallery-dialog',
      data: {
        media: image,
        cooperativeId: this.route.snapshot.params['id']
      }
    });
  }
  
  private updateMetaTags(cooperative: CooperativeResponse): void {
    const translation = this.getTranslation(cooperative);
    if (!translation) return;
    
    // Set page title
    const title = translation.seoTitle || translation.name;
    this.titleService.setTitle(title);
    
    // Set meta description
    const description = translation.seoDescription || translation.description;
    if (description) {
      this.metaService.updateTag({ name: 'description', content: description });
    }
    
    // Set keywords if available
    if (translation.seoKeywords) {
      this.metaService.updateTag({ name: 'keywords', content: translation.seoKeywords });
    }
    
    // Set Open Graph tags for better social sharing
    this.metaService.updateTag({ property: 'og:title', content: title });
    
    if (description) {
      this.metaService.updateTag({ property: 'og:description', content: description });
    }
    
    // Set image for sharing if available
    const primaryMedia = cooperative.primaryMedia;
    if (primaryMedia) {
      let ogImage = null;
      
      // First check for social share image if specified
      if (translation.socialShareImage) {
        ogImage = translation.socialShareImage;
      } 
      // Otherwise use primary media in order of preference
      else if (primaryMedia[CooperativeMediaType.HERO_IMAGE]?.fileUrl) {
        ogImage = primaryMedia[CooperativeMediaType.HERO_IMAGE].fileUrl;
      }
      else if (primaryMedia[CooperativeMediaType.GALLERY_IMAGE]?.fileUrl) {
        ogImage = primaryMedia[CooperativeMediaType.GALLERY_IMAGE].fileUrl;
      }
      else if (primaryMedia[CooperativeMediaType.LOGO]?.fileUrl) {
        ogImage = primaryMedia[CooperativeMediaType.LOGO].fileUrl;
      }
      
      if (ogImage) {
        this.metaService.updateTag({ property: 'og:image', content: ogImage });
      }
    }
    
    // Set canonical URL if available
    if (translation.canonicalUrl) {
      const link = document.querySelector('link[rel="canonical"]') || document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', translation.canonicalUrl);
      
      if (!link.parentNode) {
        document.head.appendChild(link);
      }
    }
  }
}
