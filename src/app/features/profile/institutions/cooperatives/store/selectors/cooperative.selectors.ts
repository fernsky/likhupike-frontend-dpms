import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CooperativesFeatureState } from '../state';
import { COOPERATIVES_FEATURE_KEY } from '../reducers';

// Feature selector
export const selectCooperativesFeature =
  createFeatureSelector<CooperativesFeatureState>(COOPERATIVES_FEATURE_KEY);

// Cooperative state selector
export const selectCooperativeState = createSelector(
  selectCooperativesFeature,
  (state) => state.cooperative
);

// Entity selectors
export const selectCooperativeEntities = createSelector(
  selectCooperativeState,
  (state) => state.entities
);

export const selectCooperativeIds = createSelector(
  selectCooperativeState,
  (state) => state.ids
);

export const selectAllCooperatives = createSelector(
  selectCooperativeEntities,
  selectCooperativeIds,
  (entities, ids) => ids.map((id) => entities[id])
);

export const selectTotalCooperatives = createSelector(
  selectCooperativeState,
  (state) => state.totalItems
);

export const selectSelectedCooperativeId = createSelector(
  selectCooperativeState,
  (state) => state.selectedCooperativeId
);

export const selectSelectedCooperative = createSelector(
  selectCooperativeEntities,
  selectSelectedCooperativeId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// UI state selectors
export const selectCooperativesLoading = createSelector(
  selectCooperativeState,
  (state) => state.loading
);

export const selectCooperativeCreating = createSelector(
  selectCooperativeState,
  (state) => state.creating
);

export const selectCooperativeUpdating = createSelector(
  selectCooperativeState,
  (state) => state.updating
);

export const selectCooperativeDeleting = createSelector(
  selectCooperativeState,
  (state) => state.deleting
);

export const selectCooperativeChangingStatus = createSelector(
  selectCooperativeState,
  (state) => state.changingStatus
);

export const selectCooperativeProcessing = createSelector(
  selectCooperativeState,
  (state) =>
    state.loading ||
    state.creating ||
    state.updating ||
    state.deleting ||
    state.changingStatus
);

// Result selectors
export const selectCooperativeCreateSuccess = createSelector(
  selectCooperativeState,
  (state) => state.createSuccess
);

export const selectCooperativeUpdateSuccess = createSelector(
  selectCooperativeState,
  (state) => state.updateSuccess
);

export const selectCooperativeDeleteSuccess = createSelector(
  selectCooperativeState,
  (state) => state.deleteSuccess
);

export const selectCooperativeChangeStatusSuccess = createSelector(
  selectCooperativeState,
  (state) => state.changeStatusSuccess
);

export const selectCooperativeErrors = createSelector(
  selectCooperativeState,
  (state) => state.errors
);

// Form state selectors
export const selectCooperativeHasUnsavedChanges = createSelector(
  selectCooperativeState,
  (state) => state.hasUnsavedChanges
);

export const selectCooperativeDirtyFields = createSelector(
  selectCooperativeState,
  (state) => state.dirtyFields
);

// Pagination & sorting selectors
export const selectCurrentPage = createSelector(
  selectCooperativeState,
  (state) => state.currentPage
);

export const selectPageSize = createSelector(
  selectCooperativeState,
  (state) => state.pageSize
);

export const selectSortBy = createSelector(
  selectCooperativeState,
  (state) => state.sortBy
);

export const selectSortDirection = createSelector(
  selectCooperativeState,
  (state) => state.sortDirection
);

export const selectLastUpdated = createSelector(
  selectCooperativeState,
  (state) => state.lastUpdated
);
