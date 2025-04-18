import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CooperativeResponse } from '../../../types';

/**
 * Interface for map markers representing cooperatives
 */
export interface CooperativeMapMarker {
  position: {
    lat: number;
    lng: number;
  };
  id: string;
  title: string;
  type: string;
  status: string;
  infoContent: string;
  options?: any;
}

@Component({
  selector: 'app-cooperative-map-view',
  templateUrl: './cooperative-map-view.component.html',
  styleUrls: ['./cooperative-map-view.component.scss']
})
export class CooperativeMapViewComponent implements OnInit, OnChanges {
  @Input() cooperatives: CooperativeResponse[] | null = [];
  @Input() loading = false;
  @Input() center = { lat: 27.7172, lng: 85.3240 }; // Default center (Nepal)
  @Input() zoom = 10;
  @Input() interactiveMap = true;
  
  markers: CooperativeMapMarker[] = [];
  selectedMarkerId: string | null = null;
  
  noCoordinatesCount = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.processCooperativesForMap();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperatives']) {
      this.processCooperativesForMap();
    }
  }
  
  private processCooperativesForMap(): void {
    if (!this.cooperatives) return;
    
    this.markers = [];
    this.noCoordinatesCount = 0;
    
    // Create markers for cooperatives with coordinates
    for (const coop of this.cooperatives) {
      if (coop.point && coop.point.latitude && coop.point.longitude) {
        this.markers.push({
          position: {
            lat: coop.point.latitude,
            lng: coop.point.longitude
          },
          id: coop.id,
          title: this.getCooperativeName(coop),
          type: coop.type,
          status: coop.status,
          infoContent: this.createInfoWindowContent(coop),
          options: {
            animation: 0 // No animation by default
          }
        });
      } else {
        this.noCoordinatesCount++;
      }
    }
    
    // If we have at least one marker, center the map on the first one
    if (this.markers.length > 0) {
      this.center = { ...this.markers[0].position };
      
      // Adjust zoom level based on marker count
      if (this.markers.length === 1) {
        this.zoom = 14;
      } else if (this.markers.length <= 5) {
        this.zoom = 12;
      } else if (this.markers.length <= 20) {
        this.zoom = 10;
      } else {
        this.zoom = 8;
      }
    }
  }
  
  onMarkerClick(markerId: string): void {
    this.selectedMarkerId = markerId;
    
    // Animate the selected marker
    const marker = this.markers.find(m => m.id === markerId);
    if (marker) {
      marker.options = { ...marker.options, animation: 1 }; // BOUNCE animation
      
      // Reset animation after a delay
      setTimeout(() => {
        marker.options = { ...marker.options, animation: 0 };
      }, 3000);
    }
  }
  
  viewCooperative(cooperativeId: string): void {
    this.router.navigate(['/cooperatives', cooperativeId]);
  }
  
  private createInfoWindowContent(coop: CooperativeResponse): string {
    const name = this.getCooperativeName(coop);
    const description = this.getCooperativeDescription(coop);
    
    // Create an HTML info window content
    let content = `
      <div class="map-info-window">
        <h3>${name}</h3>
    `;
    
    if (description) {
      content += `<p>${description}</p>`;
    }
    
    content += `
        <div class="info-details">
          <div>Type: ${coop.type}</div>
          <div>Status: ${coop.status}</div>
    `;
    
    if (coop.ward) {
      content += `<div>Ward: ${coop.ward}</div>`;
    }
    
    content += `
        </div>
        <div class="view-link">View Details</div>
      </div>
    `;
    
    return content;
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
    return description.length > 80 ? description.substring(0, 80) + '...' : description;
  }
}
