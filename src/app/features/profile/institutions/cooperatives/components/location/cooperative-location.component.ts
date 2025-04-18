import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { CooperativeResponse, GeoPointDto, UpdateCooperativeDto } from '../../types';
import { CooperativeActions } from '../../store/actions';

// Interface for map marker
interface MapMarker {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  info?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any;
}

@Component({
  selector: 'app-cooperative-location',
  templateUrl: './cooperative-location.component.html',
  styleUrls: ['./cooperative-location.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    TranslocoModule
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative'
    })
  ]
})
export class CooperativeLocationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cooperative!: CooperativeResponse;
  
  locationForm!: FormGroup;
  
  // Map properties
  markers: MapMarker[] = [];
  mapCenter = { lat: 27.7172, lng: 85.3240 }; // Default center (Nepal)
  mapZoom = 12;
  
  // Ward options for the location
  wards = Array.from({ length: 30 }, (_, i) => i + 1); // Wards 1-30
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperative'] && this.cooperative && this.locationForm) {
      this.updateFormValues();
      this.updateMapMarker();
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initForm(): void {
    this.locationForm = this.fb.group({
      ward: [null, Validators.required],
      point: this.fb.group({
        longitude: [null, [Validators.min(-180), Validators.max(180)]],
        latitude: [null, [Validators.min(-90), Validators.max(90)]]
      })
    });
    
    if (this.cooperative) {
      this.updateFormValues();
      this.updateMapMarker();
    }
    
    // Track form changes
    this.locationForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.store.dispatch(CooperativeActions.setUnsavedChanges({ hasUnsavedChanges: true }));
      });
      
    // Listen for point changes to update the map
    this.locationForm.get('point')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((point: GeoPointDto) => {
        if (point && point.latitude && point.longitude) {
          this.updateMapCenter(point.latitude, point.longitude);
          this.updateMapMarker();
        }
      });
  }
  
  private updateFormValues(): void {
    this.locationForm.patchValue({
      ward: this.cooperative.ward,
      point: this.cooperative.point || { longitude: null, latitude: null }
    }, { emitEvent: false });
  }
  
  private updateMapMarker(): void {
    const point = this.cooperative.point;
    
    if (point && point.latitude && point.longitude) {
      this.markers = [{
        position: {
          lat: point.latitude,
          lng: point.longitude
        },
        title: this.getCooperativeName(),
        info: this.getCooperativeName()
      }];
      
      this.updateMapCenter(point.latitude, point.longitude);
    } else {
      this.markers = [];
    }
  }
  
  private updateMapCenter(lat: number, lng: number): void {
    this.mapCenter = { lat, lng };
    this.mapZoom = 15; // Zoom in when location is set
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapClick(event: any): void {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Update form with new coordinates
    this.locationForm.get('point')?.patchValue({
      latitude: lat,
      longitude: lng
    });
    
    // Update markers
    this.markers = [{
      position: { lat, lng },
      title: this.getCooperativeName(),
      info: this.getCooperativeName()
    }];
  }
  
  onSaveLocation(): void {
    if (this.locationForm.invalid) {
      return;
    }
    
    const updateData: UpdateCooperativeDto = {
      ward: this.locationForm.get('ward')?.value,
      point: this.locationForm.get('point')?.value
    };
    
    this.store.dispatch(CooperativeActions.updateCooperative({
      id: this.cooperative.id,
      cooperative: updateData
    }));
  }
  
  clearLocation(): void {
    this.locationForm.get('point')?.patchValue({
      latitude: null,
      longitude: null
    });
    this.markers = [];
  }
  
  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          this.locationForm.get('point')?.patchValue({
            latitude: lat,
            longitude: lng
          });
          
          this.updateMapCenter(lat, lng);
          
          this.markers = [{
            position: { lat, lng },
            title: this.getCooperativeName(),
            info: this.getCooperativeName()
          }];
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  }
  
  getCooperativeName(): string {
    if (!this.cooperative.translations || this.cooperative.translations.length === 0) {
      return 'Unnamed Cooperative';
    }
    
    // First try to find translation in default locale
    const defaultTranslation = this.cooperative.translations.find(
      t => t.locale === this.cooperative.defaultLocale
    );
    
    if (defaultTranslation) {
      return defaultTranslation.name;
    }
    
    // Fall back to first available translation
    return this.cooperative.translations[0].name;
  }
}
