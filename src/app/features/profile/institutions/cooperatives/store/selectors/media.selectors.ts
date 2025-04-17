import { createSelector } from '@ngrx/store';
import { selectCooperativesFeature } from './cooperative.selectors';
import { CooperativeMediaType } from '../../types';

// Media state selector
export const selectMediaState = createSelector(
  selectCooperativesFeature,
  (state) => state.media
);

// Entity selectors
export const selectMediaEntities = createSelector(
  selectMediaState,
  (state) => state.entities
);

export const selectMediaIds = createSelector(
  selectMediaState,
  (state) => state.ids
);

export const selectAllMedia = createSelector(
  selectMediaEntities,
  selectMediaIds,
  (entities, ids) => ids.map((id) => entities[id])
);

export const selectSelectedMediaId = createSelector(
  selectMediaState,
  (state) => state.selectedMediaId
);

export const selectSelectedMedia = createSelector(
  selectMediaEntities,
  selectSelectedMediaId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// Relationship selectors
export const selectMediaByCooperative = createSelector(
  selectMediaState,
  (state) => state.mediaByCooperative
);

export const selectCooperativeMedia = (cooperativeId: string) =>
  createSelector(
    selectMediaEntities,
    selectMediaByCooperative,
    (entities, byCooperative) => {
      const ids = byCooperative[cooperativeId] || [];
      return ids.map((id) => entities[id]);
    }
  );

// Media type selectors
export const selectMediaByType = createSelector(
  selectMediaState,
  (state) => state.mediaByType
);

export const selectCooperativeMediaByType = (
  cooperativeId: string,
  type: CooperativeMediaType
) =>
  createSelector(selectMediaEntities, selectMediaByType, (entities, byType) => {
    const mediaType = byType[cooperativeId] || {};
    const ids = mediaType[type] || [];
    return ids.map((id) => entities[id]);
  });

// Primary media selectors
export const selectPrimaryMedia = createSelector(
  selectMediaState,
  (state) => state.primaryMedia
);

export const selectCooperativePrimaryMedia = (cooperativeId: string) =>
  createSelector(
    selectMediaEntities,
    selectPrimaryMedia,
    (entities, primaryMedia) => {
      const cooperativePrimary = primaryMedia[cooperativeId] || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: { [key in CooperativeMediaType]?: any } = {};

      Object.entries(cooperativePrimary).forEach(([type, id]) => {
        if (id && entities[id]) {
          result[type as CooperativeMediaType] = entities[id];
        }
      });

      return result;
    }
  );

export const selectCooperativePrimaryMediaByType = (
  cooperativeId: string,
  type: CooperativeMediaType
) =>
  createSelector(
    selectMediaEntities,
    selectPrimaryMedia,
    (entities, primaryMedia) => {
      const cooperativePrimary = primaryMedia[cooperativeId] || {};
      const id = cooperativePrimary[type];
      return id ? entities[id] : null;
    }
  );

// UI state selectors
export const selectMediaLoading = createSelector(
  selectMediaState,
  (state) => state.loading
);

export const selectMediaUploading = createSelector(
  selectMediaState,
  (state) => state.uploading
);

export const selectMediaUpdating = createSelector(
  selectMediaState,
  (state) => state.updating
);

export const selectMediaDeleting = createSelector(
  selectMediaState,
  (state) => state.deleting
);

export const selectMediaSettingPrimary = createSelector(
  selectMediaState,
  (state) => state.settingPrimary
);

export const selectMediaUpdatingVisibility = createSelector(
  selectMediaState,
  (state) => state.updatingVisibility
);

export const selectMediaProcessing = createSelector(
  selectMediaState,
  (state) =>
    state.loading ||
    state.uploading ||
    state.updating ||
    state.deleting ||
    state.settingPrimary ||
    state.updatingVisibility
);

// Result selectors
export const selectMediaUploadSuccess = createSelector(
  selectMediaState,
  (state) => state.uploadSuccess
);

export const selectMediaUpdateSuccess = createSelector(
  selectMediaState,
  (state) => state.updateSuccess
);

export const selectMediaDeleteSuccess = createSelector(
  selectMediaState,
  (state) => state.deleteSuccess
);

export const selectMediaSetPrimarySuccess = createSelector(
  selectMediaState,
  (state) => state.setPrimarySuccess
);

export const selectMediaUpdateVisibilitySuccess = createSelector(
  selectMediaState,
  (state) => state.updateVisibilitySuccess
);

export const selectMediaUploadProgress = createSelector(
  selectMediaState,
  (state) => state.uploadProgress
);

export const selectUploadedMediaId = createSelector(
  selectMediaState,
  (state) => state.uploadedMediaId
);

export const selectMediaErrors = createSelector(
  selectMediaState,
  (state) => state.errors
);

// Pagination selectors
export const selectMediaTotalItems = createSelector(
  selectMediaState,
  (state) => state.totalItems
);

export const selectMediaCurrentPage = createSelector(
  selectMediaState,
  (state) => state.currentPage
);

export const selectMediaPageSize = createSelector(
  selectMediaState,
  (state) => state.pageSize
);

export const selectMediaLastUpdated = createSelector(
  selectMediaState,
  (state) => state.lastUpdated
);
