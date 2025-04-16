import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MunicipalityActions } from './municipality.actions';
import * as MunicipalitySelectors from './municipality.selectors';
import { MunicipalityResponse, CreateMunicipalityDto, UpdateMunicipalityInfoDto, UpdateMunicipalityGeoLocationDto } from '../types';
import { MunicipalityValidationError } from './municipality.state';

/**
 * Facade service providing a simplified API for components to interact with the municipality store.
 * This separates UI components from store implementation details.
 */
@Injectable({
  providedIn: 'root',
})
export class MunicipalityFacade {
  constructor(private store: Store) {}

  // Data selectors
  municipality$: Observable<MunicipalityResponse | null> = this.store.select(
    MunicipalitySelectors.selectMunicipality
  );
  
  hasMunicipality$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectHasMunicipality
  );
  
  wardsCount$: Observable<number> = this.store.select(
    MunicipalitySelectors.selectWardsCount
  );
  
  // Loading state selectors
  loading$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectLoading
  );
  
  creating$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectCreating
  );
  
  updating$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectUpdating
  );
  
  updatingGeo$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectUpdatingGeo
  );
  
  isProcessing$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectIsProcessing
  );
  
  // Success/error selectors
  errors$: Observable<MunicipalityValidationError | null> = this.store.select(
    MunicipalitySelectors.selectErrors
  );
  
  createSuccess$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectCreateSuccess
  );
  
  updateSuccess$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectUpdateSuccess
  );
  
  updateGeoSuccess$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectUpdateGeoSuccess
  );
  
  // Form state selectors
  hasUnsavedChanges$: Observable<boolean> = this.store.select(
    MunicipalitySelectors.selectHasUnsavedChanges
  );
  
  dirtyFields$: Observable<string[]> = this.store.select(
    MunicipalitySelectors.selectDirtyFields
  );
  
  lastUpdated$: Observable<Date | null> = this.store.select(
    MunicipalitySelectors.selectLastUpdated
  );

  // Action dispatch methods
  loadMunicipality(): void {
    this.store.dispatch(MunicipalityActions.loadMunicipality());
  }
  
  createMunicipality(municipalityData: CreateMunicipalityDto): void {
    this.store.dispatch(
      MunicipalityActions.createMunicipality({ request: municipalityData })
    );
  }
  
  updateMunicipalityInfo(infoData: UpdateMunicipalityInfoDto): void {
    this.store.dispatch(
      MunicipalityActions.updateMunicipalityInfo({ request: infoData })
    );
  }
  
  updateMunicipalityGeoLocation(geoData: UpdateMunicipalityGeoLocationDto): void {
    this.store.dispatch(
      MunicipalityActions.updateMunicipalityGeoLocation({ request: geoData })
    );
  }
  
  // Form state management
  markFieldDirty(fieldName: string): void {
    this.store.dispatch(MunicipalityActions.markFieldDirty({ fieldName }));
  }
  
  clearDirtyFields(): void {
    this.store.dispatch(MunicipalityActions.clearDirtyFields());
  }
  
  setUnsavedChanges(hasUnsavedChanges: boolean): void {
    this.store.dispatch(
      MunicipalityActions.setUnsavedChanges({ hasUnsavedChanges })
    );
  }
  
  // Reset status methods
  resetCreateStatus(): void {
    this.store.dispatch(MunicipalityActions.resetCreateStatus());
  }
  
  resetUpdateStatus(): void {
    this.store.dispatch(MunicipalityActions.resetUpdateStatus());
  }
  
  resetUpdateGeoStatus(): void {
    this.store.dispatch(MunicipalityActions.resetUpdateGeoStatus());
  }
}
