import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MunicipalityState } from './municipality.state';
import { MUNICIPALITY_FEATURE_KEY } from './municipality.reducer';

// Feature selector
export const selectMunicipalityState = createFeatureSelector<MunicipalityState>(
  MUNICIPALITY_FEATURE_KEY
);

// Municipality data selectors
export const selectMunicipality = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.municipality
);

export const selectHasMunicipality = createSelector(
  selectMunicipality,
  (municipality) => municipality !== null
);

export const selectWardsCount = createSelector(
  selectMunicipality,
  (municipality) => municipality?.wardsCount || 0
);

// Loading state selectors
export const selectLoading = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.loading
);

export const selectCreating = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.creating
);

export const selectUpdating = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.updating
);

export const selectUpdatingGeo = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.updatingGeo
);

export const selectIsProcessing = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) =>
    state.loading || state.creating || state.updating || state.updatingGeo
);

// Success/error selectors
export const selectErrors = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.errors
);

export const selectCreateSuccess = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.createSuccess
);

export const selectUpdateSuccess = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.updateSuccess
);

export const selectUpdateGeoSuccess = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.updateGeoSuccess
);

// Form state selectors
export const selectHasUnsavedChanges = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.hasUnsavedChanges
);

export const selectDirtyFields = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.dirtyFields
);

export const selectLastUpdated = createSelector(
  selectMunicipalityState,
  (state: MunicipalityState) => state.lastUpdated
);
