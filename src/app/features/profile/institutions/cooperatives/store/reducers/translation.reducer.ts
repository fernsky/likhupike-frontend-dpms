import { createReducer, on } from '@ngrx/store';
import * as CooperativeTranslationActions from '../actions/translation.actions';
import { initialTranslationState } from '../state';
import { CooperativeTranslationResponse } from '../../types';

/**
 * Reducer for cooperative translation management
 */
export const translationReducer = createReducer(
  initialTranslationState,

  // Load translations
  on(CooperativeTranslationActions.loadTranslations, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeTranslationActions.loadTranslationsSuccess,
    (state, { cooperativeId, response }) => {
      if (!response.data) return state;

      const translations = response.data;
      const newEntities = { ...state.entities };
      const newIds = [...state.ids];

      // Track translations by cooperative
      const cooperativeTranslations = translations.map(
        (translation: CooperativeTranslationResponse) => {
          // Add to entities and ids if not present
          if (!newIds.includes(translation.id)) {
            newIds.push(translation.id);
          }
          newEntities[translation.id] = translation;

          return translation.id;
        }
      );

      // Update or create the mapping entry for this cooperative
      const translationsByCooperative = {
        ...state.translationsByCooperative,
        [cooperativeId]: cooperativeTranslations,
      };

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        translationsByCooperative,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTranslationActions.loadTranslationsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Load single translation
  on(
    CooperativeTranslationActions.loadTranslation,
    CooperativeTranslationActions.loadTranslationByLocale,
    (state) => ({
      ...state,
      loading: true,
      errors: null,
    })
  ),
  on(
    CooperativeTranslationActions.loadTranslationSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };
      const newIds = state.ids.includes(translation.id)
        ? state.ids
        : [...state.ids, translation.id];

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        selectedTranslationId: translation.id,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTranslationActions.loadTranslationFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Create translation
  on(CooperativeTranslationActions.createTranslation, (state) => ({
    ...state,
    creating: true,
    createSuccess: false,
    errors: null,
  })),
  on(
    CooperativeTranslationActions.createTranslationSuccess,
    (state, { cooperativeId, response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };
      const newIds = [...state.ids, translation.id];

      // Update the cooperative's translation list
      const existingIds = state.translationsByCooperative[cooperativeId] || [];
      const translationsByCooperative = {
        ...state.translationsByCooperative,
        [cooperativeId]: [...existingIds, translation.id],
      };

      return {
        ...state,
        creating: false,
        createSuccess: true,
        entities: newEntities,
        ids: newIds,
        translationsByCooperative,
        selectedTranslationId: translation.id,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTranslationActions.createTranslationFailure,
    (state, { error }) => ({
      ...state,
      creating: false,
      createSuccess: false,
      errors: error,
    })
  ),
  on(CooperativeTranslationActions.resetCreateStatus, (state) => ({
    ...state,
    creating: false,
    createSuccess: false,
    errors: null,
  })),

  // Update translation
  on(CooperativeTranslationActions.updateTranslation, (state) => ({
    ...state,
    updating: true,
    updateSuccess: false,
    errors: null,
  })),
  on(
    CooperativeTranslationActions.updateTranslationSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };

      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entities: newEntities,
        hasUnsavedChanges: false,
        dirtyFields: [],
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTranslationActions.updateTranslationFailure,
    (state, { error }) => ({
      ...state,
      updating: false,
      updateSuccess: false,
      errors: error,
    })
  ),
  on(CooperativeTranslationActions.resetUpdateStatus, (state) => ({
    ...state,
    updating: false,
    updateSuccess: false,
    errors: null,
  })),

  // Delete translation
  on(CooperativeTranslationActions.deleteTranslation, (state) => ({
    ...state,
    deleting: true,
    deleteSuccess: false,
    errors: null,
  })),
  on(
    CooperativeTranslationActions.deleteTranslationSuccess,
    (state, { cooperativeId, translationId }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [translationId]: removed, ...newEntities } = state.entities;
      const newIds = state.ids.filter((id) => id !== translationId);

      // Remove from the cooperative's translation list
      const existingIds = state.translationsByCooperative[cooperativeId] || [];
      const translationsByCooperative = {
        ...state.translationsByCooperative,
        [cooperativeId]: existingIds.filter((id) => id !== translationId),
      };

      return {
        ...state,
        deleting: false,
        deleteSuccess: true,
        entities: newEntities,
        ids: newIds,
        translationsByCooperative,
        selectedTranslationId:
          state.selectedTranslationId === translationId
            ? null
            : state.selectedTranslationId,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTranslationActions.deleteTranslationFailure,
    (state, { error }) => ({
      ...state,
      deleting: false,
      deleteSuccess: false,
      errors: error,
    })
  ),
  on(CooperativeTranslationActions.resetDeleteStatus, (state) => ({
    ...state,
    deleting: false,
    deleteSuccess: false,
    errors: null,
  })),

  // Update translation status
  on(CooperativeTranslationActions.updateTranslationStatus, (state) => ({
    ...state,
    updatingStatus: true,
    updateStatusSuccess: false,
    errors: null,
  })),
  on(
    CooperativeTranslationActions.updateStatusSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };

      return {
        ...state,
        updatingStatus: false,
        updateStatusSuccess: true,
        entities: newEntities,
        lastUpdated: new Date(),
      };
    }
  ),
  on(CooperativeTranslationActions.updateStatusFailure, (state, { error }) => ({
    ...state,
    updatingStatus: false,
    updateStatusSuccess: false,
    errors: error,
  })),
  on(CooperativeTranslationActions.resetStatusUpdate, (state) => ({
    ...state,
    updatingStatus: false,
    updateStatusSuccess: false,
    errors: null,
  })),

  // Form state management
  on(CooperativeTranslationActions.markFieldDirty, (state, { fieldName }) => ({
    ...state,
    hasUnsavedChanges: true,
    dirtyFields: state.dirtyFields.includes(fieldName)
      ? state.dirtyFields
      : [...state.dirtyFields, fieldName],
  })),
  on(CooperativeTranslationActions.clearDirtyFields, (state) => ({
    ...state,
    hasUnsavedChanges: false,
    dirtyFields: [],
  })),
  on(
    CooperativeTranslationActions.setUnsavedChanges,
    (state, { hasUnsavedChanges }) => ({
      ...state,
      hasUnsavedChanges,
    })
  ),

  // Select translation
  on(CooperativeTranslationActions.selectTranslation, (state, { id }) => ({
    ...state,
    selectedTranslationId: id,
  })),

  // Clear errors
  on(CooperativeTranslationActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
