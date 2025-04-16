import { createReducer, on } from '@ngrx/store';
import { MunicipalityActions } from './municipality.actions';
import { initialMunicipalityState, MunicipalityState } from './municipality.state';

export const MUNICIPALITY_FEATURE_KEY = 'municipalityProfile';

export const municipalityReducer = createReducer(
  initialMunicipalityState,

  // Load municipality
  on(
    MunicipalityActions.loadMunicipality,
    (state): MunicipalityState => ({
      ...state,
      loading: true,
      errors: null,
    })
  ),
  on(
    MunicipalityActions.loadMunicipalitySuccess,
    (state, { response }): MunicipalityState => ({
      ...state,
      loading: false,
      municipality: 'data' in response ? response.data : null,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    MunicipalityActions.loadMunicipalityFailure,
    (state, { error }): MunicipalityState => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Create municipality
  on(
    MunicipalityActions.createMunicipality,
    (state): MunicipalityState => ({
      ...state,
      creating: true,
      createSuccess: false,
      errors: null,
    })
  ),
  on(
    MunicipalityActions.createMunicipalitySuccess,
    (state, { response }): MunicipalityState => ({
      ...state,
      creating: false,
      createSuccess: true,
      municipality: 'data' in response ? response.data : null,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    MunicipalityActions.createMunicipalityFailure,
    (state, { error }): MunicipalityState => ({
      ...state,
      creating: false,
      createSuccess: false,
      errors: error,
    })
  ),
  on(
    MunicipalityActions.resetCreateStatus,
    (state): MunicipalityState => ({
      ...state,
      creating: false,
      createSuccess: false,
      errors: null,
    })
  ),

  // Update municipality basic info
  on(
    MunicipalityActions.updateMunicipalityInfo,
    (state): MunicipalityState => ({
      ...state,
      updating: true,
      updateSuccess: false,
      errors: null,
    })
  ),
  on(
    MunicipalityActions.updateMunicipalityInfoSuccess,
    (state, { response }): MunicipalityState => ({
      ...state,
      updating: false,
      updateSuccess: true,
      municipality: 'data' in response ? response.data : null,
      hasUnsavedChanges: false,
      dirtyFields: [],
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    MunicipalityActions.updateMunicipalityInfoFailure,
    (state, { error }): MunicipalityState => ({
      ...state,
      updating: false,
      updateSuccess: false,
      errors: error,
    })
  ),
  on(
    MunicipalityActions.resetUpdateStatus,
    (state): MunicipalityState => ({
      ...state,
      updating: false,
      updateSuccess: false,
      errors: null,
    })
  ),

  // Update municipality geo-location
  on(
    MunicipalityActions.updateMunicipalityGeoLocation,
    (state): MunicipalityState => ({
      ...state,
      updatingGeo: true,
      updateGeoSuccess: false,
      errors: null,
    })
  ),
  on(
    MunicipalityActions.updateMunicipalityGeoLocationSuccess,
    (state, { response }): MunicipalityState => ({
      ...state,
      updatingGeo: false,
      updateGeoSuccess: true,
      municipality: 'data' in response ? response.data : null,
      hasUnsavedChanges: false,
      dirtyFields: [],
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    MunicipalityActions.updateMunicipalityGeoLocationFailure,
    (state, { error }): MunicipalityState => ({
      ...state,
      updatingGeo: false,
      updateGeoSuccess: false,
      errors: error,
    })
  ),
  on(
    MunicipalityActions.resetUpdateGeoStatus,
    (state): MunicipalityState => ({
      ...state,
      updatingGeo: false,
      updateGeoSuccess: false,
      errors: null,
    })
  ),

  // Form state management
  on(
    MunicipalityActions.markFieldDirty,
    (state, { fieldName }): MunicipalityState => ({
      ...state,
      hasUnsavedChanges: true,
      dirtyFields: state.dirtyFields.includes(fieldName)
        ? state.dirtyFields
        : [...state.dirtyFields, fieldName],
    })
  ),
  on(
    MunicipalityActions.clearDirtyFields,
    (state): MunicipalityState => ({
      ...state,
      hasUnsavedChanges: false,
      dirtyFields: [],
    })
  ),
  on(
    MunicipalityActions.setUnsavedChanges,
    (state, { hasUnsavedChanges }): MunicipalityState => ({
      ...state,
      hasUnsavedChanges,
    })
  )
);
