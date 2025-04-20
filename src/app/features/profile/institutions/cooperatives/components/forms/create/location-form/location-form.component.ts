import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

import { AngularOpenlayersModule } from 'ng-openlayers';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source';
import { MapComponent, SourceVectorComponent } from 'ng-openlayers';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslocoModule,
    FormSectionComponent,
    BaseButtonComponent,
    AngularOpenlayersModule,
  ],
})
export class LocationFormComponent implements OnInit, AfterViewInit {
  @Input() parentForm!: FormGroup;
  @ViewChild('map') mapComponent?: MapComponent;
  @ViewChild('vectorSource') vectorSourceComponent?: SourceVectorComponent;

  @Output() nextStepClicked = new EventEmitter<void>();
  @Output() previousStepClicked = new EventEmitter<void>();
  @Output() getCurrentLocation = new EventEmitter<void>();

  // Map properties
  mapCenter: [number, number] = [84.124, 28.3949]; // Default center (Nepal)
  mapZoom = 7;

  // We'll get this from the ViewChild reference
  vectorSourceInstance: VectorSource | null = null;

  // State flags
  editMode = false;
  locationLoading = false;
  locationError: string | null = null;
  isUpdatingCoords = false;
  hasLocation = false;

  get pointGroup(): FormGroup {
    return this.parentForm.get('point') as FormGroup;
  }

  get latitudeControl(): FormControl {
    return this.pointGroup.get('latitude') as FormControl;
  }

  get longitudeControl(): FormControl {
    return this.pointGroup.get('longitude') as FormControl;
  }

  ngOnInit() {
    console.log('LocationFormComponent initialized');

    // Check if we already have coordinates in the form
    const lat = this.latitudeControl.value;
    const lng = this.longitudeControl.value;

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      this.hasLocation = true;
      console.log('Initial coordinates:', lat, lng);
    }

    // Add value change listeners with flag to prevent circular updates
    this.latitudeControl.valueChanges.subscribe((value) => {
      if (this.isUpdatingCoords) return;

      if (
        value !== null &&
        !isNaN(value) &&
        this.longitudeControl.value !== null &&
        !isNaN(this.longitudeControl.value)
      ) {
        console.log('Manual latitude update:', value);
        this.updateMap();
        this.hasLocation = true;
      }
    });

    this.longitudeControl.valueChanges.subscribe((value) => {
      if (this.isUpdatingCoords) return;

      if (
        value !== null &&
        !isNaN(value) &&
        this.latitudeControl.value !== null &&
        !isNaN(this.latitudeControl.value)
      ) {
        console.log('Manual longitude update:', value);
        this.updateMap();
        this.hasLocation = true;
      }
    });
  }

  ngAfterViewInit() {
    // Wait for vector source component to be available
    setTimeout(() => {
      if (this.vectorSourceComponent) {
        console.log('Vector source component found');
        this.vectorSourceInstance = this.vectorSourceComponent.instance;

        // Now that we have access to the vector source, check if we need to add a marker
        const lat = this.latitudeControl.value;
        const lng = this.longitudeControl.value;

        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
          this.updateMap();
        }
      } else {
        console.error('Vector source component not found');
      }

      // Create a blank marker image if it doesn't exist
      this.createFallbackMarkerImage();
    }, 500);
  }

  /**
   * Creates a fallback marker image if one doesn't exist
   */
  private createFallbackMarkerImage() {
    const img = new Image();
    img.src = 'assets/images/map-marker.png';
    img.onerror = () => {
      console.warn('Map marker image not found, using fallback style');
      // Switch to circle style in the template
    };
  }

  /**
   * Updates the map with current form coordinates
   */
  updateMap() {
    const lng = this.longitudeControl.value;
    const lat = this.latitudeControl.value;

    if (!lng || !lat || isNaN(lng) || isNaN(lat)) {
      return;
    }

    console.log('Setting map coordinates:', lng, lat);

    try {
      // Convert coordinates to the map's projection and update center
      const projectedCoords = fromLonLat([lng, lat]);
      this.mapCenter = projectedCoords as [number, number];
      this.mapZoom = 15;

      // Update marker if source is available
      if (this.vectorSourceInstance) {
        // Clear existing features
        this.vectorSourceInstance.clear();

        // Create a new marker at the specified coordinates
        const marker = new Feature({
          geometry: new Point(projectedCoords),
          name: 'Location marker',
        });

        // Add the marker
        this.vectorSourceInstance.addFeature(marker);
        console.log('Marker added to vector source');

        // Make sure the map renders correctly
        setTimeout(() => {
          if (this.mapComponent?.instance) {
            this.mapComponent.instance.updateSize();
          }
        }, 100);
      } else {
        console.warn('Vector source not yet available for marker creation');
      }
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }

  /**
   * Updates the form controls with new coordinates
   * Uses flag to prevent circular updates
   */
  updateFormCoordinates(longitude: number, latitude: number) {
    try {
      this.isUpdatingCoords = true;

      // Round to 6 decimal places for stability
      const roundedLng = parseFloat(longitude.toFixed(6));
      const roundedLat = parseFloat(latitude.toFixed(6));

      this.longitudeControl.setValue(roundedLng);
      this.latitudeControl.setValue(roundedLat);

      console.log('Form coordinates updated:', roundedLat, roundedLng);
    } finally {
      // Reset flag after a short delay
      setTimeout(() => {
        this.isUpdatingCoords = false;
        // Update map after form values are set
        this.updateMap();
      }, 100);
    }
  }

  /**
   * Handle click on the map (when not in edit mode)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapClick(event: any) {
    // Only handle map clicks when not in edit mode
    if (this.editMode) return;

    console.log('Map clicked (not in edit mode):', event);

    if (!event || !event.coordinate) {
      console.error('Invalid map click event');
      return;
    }

    try {
      const clickedCoord = event.coordinate;
      const lonLatCoord = toLonLat(clickedCoord);
      console.log('Clicked coordinates (lon/lat):', lonLatCoord);

      // Update form coordinates
      this.updateFormCoordinates(lonLatCoord[0], lonLatCoord[1]);
      this.hasLocation = true;
    } catch (error) {
      console.error('Error processing map click:', error);
    }
  }

  /**
   * Handles the drawEnd event from the draw interaction
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDrawEnd(event: any) {
    console.log('Draw ended:', event);

    if (!event || !event.feature) {
      console.error('Invalid draw event');
      return;
    }

    try {
      const geometry = event.feature.getGeometry();
      if (geometry) {
        const coordinates = geometry.getCoordinates();
        const lonLatCoord = toLonLat(coordinates);
        console.log('Drawn point coordinates (lon/lat):', lonLatCoord);

        // Update form controls without triggering the update map function
        this.updateFormCoordinates(lonLatCoord[0], lonLatCoord[1]);

        // Exit edit mode after drawing
        this.hasLocation = true;
        this.editMode = false;
      }
    } catch (error) {
      console.error('Error processing draw event:', error);
    }
  }

  /**
   * Toggle edit mode to allow changing the location
   */
  toggleEditMode() {
    this.editMode = !this.editMode;
    console.log('Edit mode:', this.editMode ? 'enabled' : 'disabled');
  }

  /**
   * Clear current location
   */
  clearLocation() {
    // Clear the vector source if available
    if (this.vectorSourceInstance) {
      this.vectorSourceInstance.clear();
    }

    // Reset state
    this.hasLocation = false;
    this.editMode = false;

    // Clear form values
    this.isUpdatingCoords = true;
    this.latitudeControl.setValue(null);
    this.longitudeControl.setValue(null);

    // Reset to default view
    this.mapCenter = [84.124, 28.3949];
    this.mapZoom = 7;

    // Reset the update flag
    setTimeout(() => {
      this.isUpdatingCoords = false;
    }, 100);
  }

  /**
   * Use the current device location
   */
  onUseCurrentLocation(): void {
    console.log('Getting current location');
    this.locationLoading = true;
    this.locationError = null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          console.log('Current position:', longitude, latitude);

          // Update form coordinates which will trigger map update
          this.updateFormCoordinates(longitude, latitude);

          // Update state
          this.hasLocation = true;
          this.editMode = false;
          this.locationLoading = false;

          // Emit the event for parent component
          this.getCurrentLocation.emit();
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.locationError =
            'Failed to get your location. Please check browser permissions.';
          this.locationLoading = false;
          this.getCurrentLocation.emit();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error('Geolocation not supported');
      this.locationError = 'Geolocation is not supported by your browser';
      this.locationLoading = false;
      this.getCurrentLocation.emit();
    }
  }

  onNext(): void {
    this.nextStepClicked.emit();
  }

  onPrevious(): void {
    this.previousStepClicked.emit();
  }
}
