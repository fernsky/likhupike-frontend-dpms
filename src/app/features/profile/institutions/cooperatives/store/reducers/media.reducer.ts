import { createReducer, on } from '@ngrx/store';
import * as CooperativeMediaActions from '../actions/media.actions';
import { initialMediaState } from '../state';
import { CooperativeMediaResponse, CooperativeMediaType } from '../../types';

/**
 * Reducer for cooperative media management
 */
export const mediaReducer = createReducer(
  initialMediaState,

  // Load media
  on(
    CooperativeMediaActions.loadMedia,
    CooperativeMediaActions.loadMediaByType,
    (state) => ({
      ...state,
      loading: true,
      errors: null,
    })
  ),
  on(
    CooperativeMediaActions.loadMediaSuccess,
    (state, { cooperativeId, response }) => {
      if (!response.data) return state;

      const { content, totalElements } = response.data;
      const newEntities = { ...state.entities };
      const newIds = [...state.ids];

      // Group media by type
      const mediaByType = { ...state.mediaByType };
      if (!mediaByType[cooperativeId]) {
        mediaByType[cooperativeId] = {};
      }

      // Track by cooperative
      const cooperativeMediaIds: string[] = [];

      // Process all media items
      content.forEach((media: CooperativeMediaResponse) => {
        if (!newIds.includes(media.id)) {
          newIds.push(media.id);
        }
        newEntities[media.id] = media;
        cooperativeMediaIds.push(media.id);

        // Track by type
        if (!mediaByType[cooperativeId][media.type]) {
          mediaByType[cooperativeId][media.type] = [];
        }
        if (!mediaByType[cooperativeId][media.type]!.includes(media.id)) {
          mediaByType[cooperativeId][media.type]!.push(media.id);
        }

        // Update primary media mapping
        if (media.isPrimary) {
          const primaryMedia = { ...state.primaryMedia };
          if (!primaryMedia[cooperativeId]) {
            primaryMedia[cooperativeId] = {};
          }
          primaryMedia[cooperativeId][media.type] = media.id;

          state = {
            ...state,
            primaryMedia,
          };
        }
      });

      // Update media by cooperative mapping
      const mediaByCooperative = {
        ...state.mediaByCooperative,
        [cooperativeId]: cooperativeMediaIds,
      };

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        mediaByCooperative,
        mediaByType,
        totalItems: totalElements,
        lastUpdated: new Date(),
      };
    }
  ),
  on(CooperativeMediaActions.loadMediaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Load single media
  on(CooperativeMediaActions.loadMediaItem, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(CooperativeMediaActions.loadMediaItemSuccess, (state, { response }) => {
    if (!response.data) return state;

    const media = response.data;
    const newEntities = { ...state.entities, [media.id]: media };
    const newIds = state.ids.includes(media.id)
      ? state.ids
      : [...state.ids, media.id];

    return {
      ...state,
      loading: false,
      entities: newEntities,
      ids: newIds,
      selectedMediaId: media.id,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeMediaActions.loadMediaItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Upload media
  on(CooperativeMediaActions.uploadMedia, (state) => ({
    ...state,
    uploading: true,
    uploadSuccess: false,
    uploadProgress: 0,
    uploadedMediaId: null,
    errors: null,
  })),
  on(CooperativeMediaActions.uploadProgress, (state, { progress }) => ({
    ...state,
    uploadProgress: progress,
  })),
  on(CooperativeMediaActions.uploadMediaSuccess, (state, { response }) => {
    if (!response.data) return state;

    // Since this is just the upload response, we don't have full media data yet
    // We'll set a flag that upload completed and store the ID for future reference
    return {
      ...state,
      uploading: false,
      uploadSuccess: true,
      uploadProgress: 100,
      uploadedMediaId: response.data.id,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeMediaActions.uploadMediaFailure, (state, { error }) => ({
    ...state,
    uploading: false,
    uploadSuccess: false,
    uploadProgress: 0,
    errors: error,
  })),
  on(CooperativeMediaActions.resetUploadStatus, (state) => ({
    ...state,
    uploading: false,
    uploadSuccess: false,
    uploadProgress: 0,
    uploadedMediaId: null,
    errors: null,
  })),

  // Update media metadata
  on(CooperativeMediaActions.updateMediaMetadata, (state) => ({
    ...state,
    updating: true,
    updateSuccess: false,
    errors: null,
  })),
  on(CooperativeMediaActions.updateMetadataSuccess, (state, { response }) => {
    if (!response.data) return state;

    const media = response.data;
    const cooperativeId = media.id.split('-')[0]; // Assuming format is cooperativeId-mediaId
    const newEntities = { ...state.entities, [media.id]: media };

    // Update primary status if needed
    let newState = {
      ...state,
      updating: false,
      updateSuccess: true,
      entities: newEntities,
      lastUpdated: new Date(),
    };

    // Update primary mapping if this is now a primary item
    if (media.isPrimary) {
      const primaryMedia = { ...state.primaryMedia };
      if (!primaryMedia[cooperativeId]) {
        primaryMedia[cooperativeId] = {};
      }
      primaryMedia[cooperativeId][media.type as CooperativeMediaType] =
        media.id;

      newState = {
        ...newState,
        primaryMedia,
      };
    }

    return newState;
  }),
  on(CooperativeMediaActions.updateMetadataFailure, (state, { error }) => ({
    ...state,
    updating: false,
    updateSuccess: false,
    errors: error,
  })),
  on(CooperativeMediaActions.resetUpdateStatus, (state) => ({
    ...state,
    updating: false,
    updateSuccess: false,
    errors: null,
  })),

  // Delete media
  on(CooperativeMediaActions.deleteMedia, (state) => ({
    ...state,
    deleting: true,
    deleteSuccess: false,
    errors: null,
  })),
  on(
    CooperativeMediaActions.deleteMediaSuccess,
    (state, { cooperativeId, mediaId }) => {
      const { [mediaId]: removedMedia, ...newEntities } = state.entities;
      const newIds = state.ids.filter((id) => id !== mediaId);

      // Remove from cooperative's media list
      const mediaByCooperative = { ...state.mediaByCooperative };
      if (mediaByCooperative[cooperativeId]) {
        mediaByCooperative[cooperativeId] = mediaByCooperative[
          cooperativeId
        ].filter((id) => id !== mediaId);
      }

      // Remove from type-based grouping
      const mediaByType = { ...state.mediaByType };
      if (mediaByType[cooperativeId] && removedMedia) {
        const mediaType = removedMedia.type;
        if (mediaByType[cooperativeId][mediaType]) {
          mediaByType[cooperativeId][mediaType] = mediaByType[cooperativeId][
            mediaType
          ]!.filter((id) => id !== mediaId);
        }
      }

      // Update primary mapping if needed
      let newState = {
        ...state,
        deleting: false,
        deleteSuccess: true,
        entities: newEntities,
        ids: newIds,
        mediaByCooperative,
        mediaByType,
        selectedMediaId:
          state.selectedMediaId === mediaId ? null : state.selectedMediaId,
        lastUpdated: new Date(),
      };

      // If this was a primary media item, clear that reference
      if (removedMedia && removedMedia.isPrimary) {
        const primaryMedia = { ...state.primaryMedia };
        if (
          primaryMedia[cooperativeId] &&
          primaryMedia[cooperativeId][removedMedia.type] === mediaId
        ) {
          primaryMedia[cooperativeId][removedMedia.type] = undefined;

          newState = {
            ...newState,
            primaryMedia,
          };
        }
      }

      return newState;
    }
  ),
  on(CooperativeMediaActions.deleteMediaFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    deleteSuccess: false,
    errors: error,
  })),
  on(CooperativeMediaActions.resetDeleteStatus, (state) => ({
    ...state,
    deleting: false,
    deleteSuccess: false,
    errors: null,
  })),

  // Set media as primary
  on(CooperativeMediaActions.setMediaAsPrimary, (state) => ({
    ...state,
    settingPrimary: true,
    setPrimarySuccess: false,
    errors: null,
  })),
  on(
    CooperativeMediaActions.setPrimarySuccess,
    (state, { cooperativeId, response }) => {
      if (!response.data) return state;

      const media = response.data;
      const newEntities: { [key: string]: CooperativeMediaResponse } = {
        ...state.entities,
        [media.id]: media,
      };

      // Update the primary media mapping
      const primaryMedia = { ...state.primaryMedia };
      if (!primaryMedia[cooperativeId]) {
        primaryMedia[cooperativeId] = {};
      }
      primaryMedia[cooperativeId][media.type as CooperativeMediaType] =
        media.id;

      // If there were other primary items of the same type, update them to non-primary
      const mediaByType = { ...state.mediaByType };
      if (
        mediaByType[cooperativeId] &&
        mediaByType[cooperativeId][media.type as CooperativeMediaType]
      ) {
        mediaByType[cooperativeId][media.type as CooperativeMediaType]!.forEach(
          (otherMediaId) => {
            if (otherMediaId !== media.id && state.entities[otherMediaId]) {
              newEntities[otherMediaId] = {
                ...state.entities[otherMediaId],
                isPrimary: false,
              };
            }
          }
        );
      }

      return {
        ...state,
        settingPrimary: false,
        setPrimarySuccess: true,
        entities: newEntities,
        primaryMedia,
        lastUpdated: new Date(),
      };
    }
  ),
  on(CooperativeMediaActions.setPrimaryFailure, (state, { error }) => ({
    ...state,
    settingPrimary: false,
    setPrimarySuccess: false,
    errors: error,
  })),
  on(CooperativeMediaActions.resetPrimaryStatus, (state) => ({
    ...state,
    settingPrimary: false,
    setPrimarySuccess: false,
    errors: null,
  })),

  // Update media visibility
  on(CooperativeMediaActions.updateMediaVisibility, (state) => ({
    ...state,
    updatingVisibility: true,
    updateVisibilitySuccess: false,
    errors: null,
  })),
  on(CooperativeMediaActions.updateVisibilitySuccess, (state, { response }) => {
    if (!response.data) return state;

    const media = response.data;
    const newEntities = { ...state.entities, [media.id]: media };

    return {
      ...state,
      updatingVisibility: false,
      updateVisibilitySuccess: true,
      entities: newEntities,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeMediaActions.updateVisibilityFailure, (state, { error }) => ({
    ...state,
    updatingVisibility: false,
    updateVisibilitySuccess: false,
    errors: error,
  })),
  on(CooperativeMediaActions.resetVisibilityStatus, (state) => ({
    ...state,
    updatingVisibility: false,
    updateVisibilitySuccess: false,
    errors: null,
  })),

  // Select media
  on(CooperativeMediaActions.selectMedia, (state, { id }) => ({
    ...state,
    selectedMediaId: id,
  })),

  // Pagination
  on(CooperativeMediaActions.setMediaPage, (state, { page }) => ({
    ...state,
    currentPage: page,
  })),
  on(CooperativeMediaActions.setMediaPageSize, (state, { size }) => ({
    ...state,
    pageSize: size,
  })),

  // Clear errors
  on(CooperativeMediaActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
