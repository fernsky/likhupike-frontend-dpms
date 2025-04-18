import { createAction, props } from '@ngrx/store';
import {
  ApiResponse,
  ContentStatus,
  CreateCooperativeTranslationDto,
  CooperativeTranslationResponse,
  UpdateCooperativeTranslationDto
} from '../../types';
import { CooperativeValidationError } from '../state';

// Load Cooperative Translations
export const loadTranslations = createAction(
  '[CooperativeTranslation] Load Translations',
  props<{ cooperativeId: string }>()
);

export const loadTranslationsSuccess = createAction(
  '[CooperativeTranslation] Load Translations Success',
  props<{
    cooperativeId: string;
    response: ApiResponse<CooperativeTranslationResponse[]>;
  }>()
);

export const loadTranslationsFailure = createAction(
  '[CooperativeTranslation] Load Translations Failure',
  props<{ error: CooperativeValidationError }>()
);

// Load Single Translation
export const loadTranslation = createAction(
  '[CooperativeTranslation] Load Translation',
  props<{ cooperativeId: string; translationId: string }>()
);

export const loadTranslationByLocale = createAction(
  '[CooperativeTranslation] Load Translation By Locale',
  props<{ cooperativeId: string; locale: string }>()
);

export const loadTranslationSuccess = createAction(
  '[CooperativeTranslation] Load Translation Success',
  props<{ response: ApiResponse<CooperativeTranslationResponse> }>()
);

export const loadTranslationFailure = createAction(
  '[CooperativeTranslation] Load Translation Failure',
  props<{ error: CooperativeValidationError }>()
);

// Create Translation
export const createTranslation = createAction(
  '[CooperativeTranslation] Create Translation',
  props<{
    cooperativeId: string;
    translation: CreateCooperativeTranslationDto;
  }>()
);

export const createTranslationSuccess = createAction(
  '[CooperativeTranslation] Create Translation Success',
  props<{
    cooperativeId: string;
    response: ApiResponse<CooperativeTranslationResponse>;
  }>()
);

export const createTranslationFailure = createAction(
  '[CooperativeTranslation] Create Translation Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetCreateStatus = createAction(
  '[CooperativeTranslation] Reset Create Status'
);

// Update Translation
export const updateTranslation = createAction(
  '[CooperativeTranslation] Update Translation',
  props<{
    cooperativeId: string;
    translationId: string;
    translation: UpdateCooperativeTranslationDto;
  }>()
);

export const updateTranslationSuccess = createAction(
  '[CooperativeTranslation] Update Translation Success',
  props<{ response: ApiResponse<CooperativeTranslationResponse> }>()
);

export const updateTranslationFailure = createAction(
  '[CooperativeTranslation] Update Translation Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetUpdateStatus = createAction(
  '[CooperativeTranslation] Reset Update Status'
);

// Delete Translation
export const deleteTranslation = createAction(
  '[CooperativeTranslation] Delete Translation',
  props<{ cooperativeId: string; translationId: string }>()
);

export const deleteTranslationSuccess = createAction(
  '[CooperativeTranslation] Delete Translation Success',
  props<{
    cooperativeId: string;
    translationId: string;
    response: ApiResponse<void>;
  }>()
);

export const deleteTranslationFailure = createAction(
  '[CooperativeTranslation] Delete Translation Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetDeleteStatus = createAction(
  '[CooperativeTranslation] Reset Delete Status'
);

// Update Translation Status
export const updateTranslationStatus = createAction(
  '[CooperativeTranslation] Update Translation Status',
  props<{
    cooperativeId: string;
    translationId: string;
    status: ContentStatus;
  }>()
);

export const updateStatusSuccess = createAction(
  '[CooperativeTranslation] Update Status Success',
  props<{ response: ApiResponse<CooperativeTranslationResponse> }>()
);

export const updateStatusFailure = createAction(
  '[CooperativeTranslation] Update Status Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetStatusUpdate = createAction(
  '[CooperativeTranslation] Reset Status Update'
);

// Form State Management
export const markFieldDirty = createAction(
  '[CooperativeTranslation] Mark Field Dirty',
  props<{ fieldName: string }>()
);

export const clearDirtyFields = createAction(
  '[CooperativeTranslation] Clear Dirty Fields'
);

export const setUnsavedChanges = createAction(
  '[CooperativeTranslation] Set Unsaved Changes',
  props<{ hasUnsavedChanges: boolean }>()
);

// Select Translation
export const selectTranslation = createAction(
  '[CooperativeTranslation] Select Translation',
  props<{ id: string | null }>()
);

// Clear Errors
export const clearErrors = createAction(
  '[CooperativeTranslation] Clear Errors'
);
