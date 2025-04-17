import { createSelector } from '@ngrx/store';
import { selectCooperativesFeature } from './cooperative.selectors';

// Translation state selector
export const selectTranslationState = createSelector(
  selectCooperativesFeature,
  (state) => state.translation
);

// Entity selectors
export const selectTranslationEntities = createSelector(
  selectTranslationState,
  (state) => state.entities
);

export const selectTranslationIds = createSelector(
  selectTranslationState,
  (state) => state.ids
);

export const selectAllTranslations = createSelector(
  selectTranslationEntities,
  selectTranslationIds,
  (entities, ids) => ids.map((id) => entities[id])
);

export const selectSelectedTranslationId = createSelector(
  selectTranslationState,
  (state) => state.selectedTranslationId
);

export const selectSelectedTranslation = createSelector(
  selectTranslationEntities,
  selectSelectedTranslationId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// Relationship selectors
export const selectTranslationsByCooperative = createSelector(
  selectTranslationState,
  (state) => state.translationsByCooperative
);

export const selectCooperativeTranslations = (cooperativeId: string) =>
  createSelector(
    selectTranslationEntities,
    selectTranslationsByCooperative,
    (entities, byCooperative) => {
      const ids = byCooperative[cooperativeId] || [];
      return ids.map((id) => entities[id]);
    }
  );

// UI state selectors
export const selectTranslationsLoading = createSelector(
  selectTranslationState,
  (state) => state.loading
);

export const selectTranslationCreating = createSelector(
  selectTranslationState,
  (state) => state.creating
);

export const selectTranslationUpdating = createSelector(
  selectTranslationState,
  (state) => state.updating
);

export const selectTranslationDeleting = createSelector(
  selectTranslationState,
  (state) => state.deleting
);

export const selectTranslationUpdatingStatus = createSelector(
  selectTranslationState,
  (state) => state.updatingStatus
);

export const selectTranslationProcessing = createSelector(
  selectTranslationState,
  (state) =>
    state.loading ||
    state.creating ||
    state.updating ||
    state.deleting ||
    state.updatingStatus
);

// Result selectors
export const selectTranslationCreateSuccess = createSelector(
  selectTranslationState,
  (state) => state.createSuccess
);

export const selectTranslationUpdateSuccess = createSelector(
  selectTranslationState,
  (state) => state.updateSuccess
);

export const selectTranslationDeleteSuccess = createSelector(
  selectTranslationState,
  (state) => state.deleteSuccess
);

export const selectTranslationUpdateStatusSuccess = createSelector(
  selectTranslationState,
  (state) => state.updateStatusSuccess
);

export const selectTranslationErrors = createSelector(
  selectTranslationState,
  (state) => state.errors
);

// Form state selectors
export const selectTranslationHasUnsavedChanges = createSelector(
  selectTranslationState,
  (state) => state.hasUnsavedChanges
);

export const selectTranslationDirtyFields = createSelector(
  selectTranslationState,
  (state) => state.dirtyFields
);

export const selectTranslationLastUpdated = createSelector(
  selectTranslationState,
  (state) => state.lastUpdated
);
