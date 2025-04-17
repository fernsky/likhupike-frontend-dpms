import { createActionGroup, emptyProps, props } from '@ngrx/store';
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

/**
 * Actions for managing cooperative media
 */
export const CooperativeMediaActions = createActionGroup({
  source: 'Cooperative Media',
  events: {
    // Load Media
    'Load Media': props<{
      cooperativeId: string;
      page: number;
      size: number;
    }>(),
    'Load Media By Type': props<{
      cooperativeId: string;
      type: CooperativeMediaType;
      page: number;
      size: number;
    }>(),
    'Load Media Success': props<{
      cooperativeId: string;
      response: ApiResponse<PageResponse<CooperativeMediaResponse>>;
    }>(),
    'Load Media Failure': props<{ error: CooperativeValidationError }>(),

    // Load Single Media
    'Load Media Item': props<{ cooperativeId: string; mediaId: string }>(),
    'Load Media Item Success': props<{
      response: ApiResponse<CooperativeMediaResponse>;
    }>(),
    'Load Media Item Failure': props<{ error: CooperativeValidationError }>(),

    // Upload Media
    'Upload Media': props<{
      cooperativeId: string;
      file: File;
      metadata: CreateCooperativeMediaDto;
    }>(),
    'Upload Progress': props<{ progress: number }>(),
    'Upload Media Success': props<{
      cooperativeId: string;
      response: ApiResponse<MediaUploadResponse>;
    }>(),
    'Upload Media Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Upload Status': emptyProps(),

    // Update Media Metadata
    'Update Media Metadata': props<{
      cooperativeId: string;
      mediaId: string;
      metadata: UpdateCooperativeMediaDto;
    }>(),
    'Update Metadata Success': props<{
      response: ApiResponse<CooperativeMediaResponse>;
    }>(),
    'Update Metadata Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Update Status': emptyProps(),

    // Delete Media
    'Delete Media': props<{ cooperativeId: string; mediaId: string }>(),
    'Delete Media Success': props<{
      cooperativeId: string;
      mediaId: string;
      response: ApiResponse<void>;
    }>(),
    'Delete Media Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Delete Status': emptyProps(),

    // Set Media as Primary
    'Set Media As Primary': props<{ cooperativeId: string; mediaId: string }>(),
    'Set Primary Success': props<{
      cooperativeId: string;
      response: ApiResponse<CooperativeMediaResponse>;
    }>(),
    'Set Primary Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Primary Status': emptyProps(),

    // Update Media Visibility
    'Update Media Visibility': props<{
      cooperativeId: string;
      mediaId: string;
      status: MediaVisibilityStatus;
    }>(),
    'Update Visibility Success': props<{
      cooperativeId: string;
      response: ApiResponse<CooperativeMediaResponse>;
    }>(),
    'Update Visibility Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Visibility Status': emptyProps(),

    // Clear Errors
    'Clear Errors': emptyProps(),

    // Set Selected Media
    'Select Media': props<{ id: string | null }>(),

    // Change Media Pagination
    'Set Media Page': props<{ page: number }>(),
    'Set Media Page Size': props<{ size: number }>(),
  },
});
