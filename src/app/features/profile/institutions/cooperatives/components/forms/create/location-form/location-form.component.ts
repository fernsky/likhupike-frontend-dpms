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
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

import { AngularOpenlayersModule } from 'ng-openlayers';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source';
import { MapComponent, SourceVectorComponent } from 'ng-openlayers';
import { MatButtonModule } from '@angular/material/button';
import { IconButtonComponent } from '@app/shared/components/icon-button/icon-button.component';

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
    IconButtonComponent, // Add the new component
    AngularOpenlayersModule,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class LocationFormComponent implements OnInit, AfterViewInit {
  @Input() parentForm!: FormGroup;
  @ViewChild('map') mapComponent?: MapComponent;
  @ViewChild('vectorSource') vectorSourceComponent?: SourceVectorComponent;

  @Output() nextStepClicked = new EventEmitter<void>();
  @Output() previousStepClicked = new EventEmitter<void>();
  @Output() getCurrentLocation = new EventEmitter<void>();

  // Map properties - using direct longitude, latitude coordinates
  mapCenter: [number, number] = [84.124, 28.3949]; // Default center (Nepal)
  mapZoom = 7;

  // We'll get this from the ViewChild reference
  vectorSourceInstance: VectorSource | null = null;

  // Temporary coordinates for edit mode
  tempCoordinates: { longitude: number | null; latitude: number | null } = {
    longitude: null,
    latitude: null,
  };

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
      // We have coordinates, so start in view mode
      this.hasLocation = true;
      this.editMode = false;
      console.log('Initial coordinates found:', lat, lng);

      // Set map center to initial coordinates
      this.mapCenter = [lng, lat];
    } else {
      // No coordinates, so start in edit mode
      this.hasLocation = false;
      this.editMode = true;
      console.log('No initial coordinates, starting in edit mode');
    }

    // Store current coordinates as temp values when entering edit mode
    this.saveCurrentCoordinates();
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
    }, 500);
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
      // Update map center with direct coordinates
      this.mapCenter = [lng, lat];
      this.mapZoom = 15;

      // Update marker if source is available
      if (this.vectorSourceInstance) {
        // Clear existing features
        this.vectorSourceInstance.clear();

        // Create a new marker at the specified coordinates - using fromLonLat for marker position
        const marker = new Feature({
          geometry: new Point(fromLonLat([lng, lat])),
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
   * Save current coordinates to temporary storage
   */
  private saveCurrentCoordinates() {
    this.tempCoordinates = {
      longitude: this.longitudeControl.value,
      latitude: this.latitudeControl.value,
    };
    console.log('Saved coordinates:', this.tempCoordinates);
  }

  /**
   * Restore coordinates from temporary storage
   */
  private restoreCoordinates() {
    if (
      this.tempCoordinates.longitude !== null &&
      this.tempCoordinates.latitude !== null
    ) {
      this.isUpdatingCoords = true;
      this.longitudeControl.setValue(this.tempCoordinates.longitude);
      this.latitudeControl.setValue(this.tempCoordinates.latitude);

      setTimeout(() => {
        this.isUpdatingCoords = false;
        this.updateMap();
      }, 100);

      console.log('Restored coordinates:', this.tempCoordinates);
    }
  }

  /**
   * Handle location selection from map click or draw
   */
  private handleLocationSelection(coordinates: number[]) {
    if (!this.editMode) {
      console.log('Not in edit mode, ignoring location selection');
      return;
    }

    try {
      const lonLatCoord = toLonLat(coordinates);
      console.log('Selected coordinates (lon/lat):', lonLatCoord);

      // Update the temporary form values while in edit mode
      this.isUpdatingCoords = true;
      // Round to 6 decimal places for stability
      const roundedLng = parseFloat(lonLatCoord[0].toFixed(6));
      const roundedLat = parseFloat(lonLatCoord[1].toFixed(6));

      this.longitudeControl.setValue(roundedLng);
      this.latitudeControl.setValue(roundedLat);

      // Update the map to show the new position
      setTimeout(() => {
        this.isUpdatingCoords = false;
        this.updateMap();
      }, 100);

      this.hasLocation = true;
    } catch (error) {
      console.error('Error processing location selection:', error);
    }
  }

  /**
   * Handle click on the map (when not in edit mode)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapClick(event: any) {
    console.log('Map clicked, edit mode:', this.editMode);

    if (!event || !event.coordinate) {
      console.error('Invalid map click event');
      return;
    }

    this.handleLocationSelection(event.coordinate);
  }

  /**
   * Handles the drawEnd event from the draw interaction
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDrawEnd(event: any) {
    console.log('Draw ended, edit mode:', this.editMode);

    if (!event || !event.feature) {
      console.error('Invalid draw event');
      return;
    }

    try {
      const geometry = event.feature.getGeometry();
      if (geometry) {
        this.handleLocationSelection(geometry.getCoordinates());
      }
    } catch (error) {
      console.error('Error processing draw event:', error);
    }
  }

  /**
   * Toggle edit mode to allow changing the location
   */
  toggleEditMode() {
    if (this.editMode) {
      // Exiting edit mode (saving changes)
      this.editMode = false;
      console.log('Exiting edit mode, saving changes');

      // The current form values are already updated and will be kept
      // Update the temporary stored coordinates with the new values
      this.saveCurrentCoordinates();
    } else {
      // Entering edit mode
      this.editMode = true;
      console.log('Entering edit mode');

      // Save current coordinates before editing
      this.saveCurrentCoordinates();
    }
  }

  /**
   * Cancel edit mode without saving changes
   */
  cancelEdit() {
    this.editMode = false;
    console.log('Canceling edit mode, restoring previous coordinates');

    // Restore the previous coordinates
    this.restoreCoordinates();
  }

  /**
   * Clear current location
   */
  clearLocation() {
    console.log('Clearing location');

    // Clear the vector source if available
    if (this.vectorSourceInstance) {
      this.vectorSourceInstance.clear();
    }

    // Reset state
    this.hasLocation = false;
    this.editMode = true; // Enter edit mode after clearing

    // Clear form values
    this.isUpdatingCoords = true;
    this.longitudeControl.setValue(null);
    this.latitudeControl.setValue(null);

    // Clear temporary coordinates
    this.tempCoordinates = {
      longitude: null,
      latitude: null,
    };

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

    // Only proceed if in edit mode
    if (!this.editMode) {
      console.log('Not in edit mode, ignoring current location request');
      return;
    }

    this.locationLoading = true;
    this.locationError = null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          console.log('Current position:', longitude, latitude);

          // Update form controls
          this.isUpdatingCoords = true;
          this.longitudeControl.setValue(parseFloat(longitude.toFixed(6)));
          this.latitudeControl.setValue(parseFloat(latitude.toFixed(6)));

          setTimeout(() => {
            this.isUpdatingCoords = false;
            this.updateMap();
          }, 100);

          this.hasLocation = true;
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
