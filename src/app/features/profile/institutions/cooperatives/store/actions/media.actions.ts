import { createAction, props } from '@ngrx/store';
import {
  ApiResponse,
  CooperativeMediaResponse,
  CooperativeMediaType,
  CreateCooperativeMediaDto,
  MediaUploadResponse,
  MediaVisibilityStatus,
  PageResponse,
  UpdateCooperativeMediaDto,
} from '../../types';
import { CooperativeValidationError } from '../state';

// Load Media
export const loadMedia = createAction(
  '[Cooperative Media] Load Media',
  props<{
    cooperativeId: string;
    page: number;
    size: number;
  }>()
);

export const loadMediaByType = createAction(
  '[Cooperative Media] Load Media By Type',
  props<{
    cooperativeId: string;
    mediaType: CooperativeMediaType;
    page: number;
    size: number;
  }>()
);

export const loadMediaSuccess = createAction(
  '[Cooperative Media] Load Media Success',
  props<{
    cooperativeId: string;
    response: ApiResponse<PageResponse<CooperativeMediaResponse>>;
  }>()
);

export const loadMediaFailure = createAction(
  '[Cooperative Media] Load Media Failure',
  props<{ error: CooperativeValidationError }>()
);

// Load Single Media
export const loadMediaItem = createAction(
  '[Cooperative Media] Load Media Item',
  props<{ cooperativeId: string; mediaId: string }>()
);

export const loadMediaItemSuccess = createAction(
  '[Cooperative Media] Load Media Item Success',
  props<{
    response: ApiResponse<CooperativeMediaResponse>;
  }>()
);

export const loadMediaItemFailure = createAction(
  '[Cooperative Media] Load Media Item Failure',
  props<{ error: CooperativeValidationError }>()
);

// Upload Media
export const uploadMedia = createAction(
  '[Cooperative Media] Upload Media',
  props<{
    cooperativeId: string;
    file: File;
    metadata: CreateCooperativeMediaDto;
  }>()
);

export const uploadProgress = createAction(
  '[Cooperative Media] Upload Progress',
  props<{ progress: number }>()
);

export const uploadMediaSuccess = createAction(
  '[Cooperative Media] Upload Media Success',
  props<{
    cooperativeId: string;
    response: ApiResponse<MediaUploadResponse>;
  }>()
);

export const uploadMediaFailure = createAction(
  '[Cooperative Media] Upload Media Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetUploadStatus = createAction(
  '[Cooperative Media] Reset Upload Status'
);

// Update Media Metadata
export const updateMediaMetadata = createAction(
  '[Cooperative Media] Update Media Metadata',
  props<{
    cooperativeId: string;
    mediaId: string;
    metadata: UpdateCooperativeMediaDto;
  }>()
);

export const updateMetadataSuccess = createAction(
  '[Cooperative Media] Update Metadata Success',
  props<{
    response: ApiResponse<CooperativeMediaResponse>;
  }>()
);

export const updateMetadataFailure = createAction(
  '[Cooperative Media] Update Metadata Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetUpdateStatus = createAction(
  '[Cooperative Media] Reset Update Status'
);

// Delete Media
export const deleteMedia = createAction(
  '[Cooperative Media] Delete Media',
  props<{ cooperativeId: string; mediaId: string }>()
);

export const deleteMediaSuccess = createAction(
  '[Cooperative Media] Delete Media Success',
  props<{
    cooperativeId: string;
    mediaId: string;
    response: ApiResponse<void>;
  }>()
);

export const deleteMediaFailure = createAction(
  '[Cooperative Media] Delete Media Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetDeleteStatus = createAction(
  '[Cooperative Media] Reset Delete Status'
);

// Set Media as Primary
export const setMediaAsPrimary = createAction(
  '[Cooperative Media] Set Media As Primary',
  props<{ cooperativeId: string; mediaId: string }>()
);

export const setPrimarySuccess = createAction(
  '[Cooperative Media] Set Primary Success',
  props<{
    cooperativeId: string;
    response: ApiResponse<CooperativeMediaResponse>;
  }>()
);

export const setPrimaryFailure = createAction(
  '[Cooperative Media] Set Primary Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetPrimaryStatus = createAction(
  '[Cooperative Media] Reset Primary Status'
);

// Update Media Visibility
export const updateMediaVisibility = createAction(
  '[Cooperative Media] Update Media Visibility',
  props<{
    cooperativeId: string;
    mediaId: string;
    status: MediaVisibilityStatus;
  }>()
);

export const updateVisibilitySuccess = createAction(
  '[Cooperative Media] Update Visibility Success',
  props<{
    cooperativeId: string;
    response: ApiResponse<CooperativeMediaResponse>;
  }>()
);

export const updateVisibilityFailure = createAction(
  '[Cooperative Media] Update Visibility Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetVisibilityStatus = createAction(
  '[Cooperative Media] Reset Visibility Status'
);

// Clear Errors
export const clearErrors = createAction(
  '[Cooperative Media] Clear Errors'
);

// Set Selected Media
export const selectMedia = createAction(
  '[Cooperative Media] Select Media',
  props<{ id: string | null }>()
);

// Change Media Pagination
export const setMediaPage = createAction(
  '[Cooperative Media] Set Media Page',
  props<{ page: number }>()
);

export const setMediaPageSize = createAction(
  '[Cooperative Media] Set Media Page Size',
  props<{ size: number }>()
);
