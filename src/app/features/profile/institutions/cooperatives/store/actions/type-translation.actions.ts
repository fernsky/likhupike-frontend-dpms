import { createAction, props } from '@ngrx/store';
import {
  ApiResponse,
  CooperativeType,
  CooperativeTypeTranslationDto,
  CooperativeTypeTranslationResponse,
  PageResponse,
} from '../../types';
import { CooperativeValidationError } from '../state';

// Create or Update Type Translation
export const createOrUpdateTypeTranslation = createAction(
  '[Cooperative Type Translations] Create Or Update Type Translation',
  props<{
    translation: CooperativeTypeTranslationDto;
  }>()
);

export const createOrUpdateSuccess = createAction(
  '[Cooperative Type Translations] Create Or Update Success',
  props<{
    response: ApiResponse<CooperativeTypeTranslationResponse>;
  }>()
);

export const createOrUpdateFailure = createAction(
  '[Cooperative Type Translations] Create Or Update Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get Type Translation By ID
export const getTypeTranslation = createAction(
  '[Cooperative Type Translations] Get Type Translation',
  props<{ id: string }>()
);

export const getTypeTranslationSuccess = createAction(
  '[Cooperative Type Translations] Get Type Translation Success',
  props<{
    response: ApiResponse<CooperativeTypeTranslationResponse>;
  }>()
);

export const getTypeTranslationFailure = createAction(
  '[Cooperative Type Translations] Get Type Translation Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get By Type And Locale
export const getTypeTranslationByTypeAndLocale = createAction(
  '[Cooperative Type Translations] Get Type Translation By Type And Locale',
  props<{
    cooperativeType: CooperativeType;
    locale: string;
  }>()
);

export const getByTypeAndLocaleSuccess = createAction(
  '[Cooperative Type Translations] Get By Type And Locale Success',
  props<{
    response: ApiResponse<CooperativeTypeTranslationResponse>;
  }>()
);

export const getByTypeAndLocaleFailure = createAction(
  '[Cooperative Type Translations] Get By Type And Locale Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get All Translations For Type
export const getAllForType = createAction(
  '[Cooperative Type Translations] Get All For Type',
  props<{ cooperativeType: CooperativeType }>()
);

export const getAllForTypeSuccess = createAction(
  '[Cooperative Type Translations] Get All For Type Success',
  props<{
    cooperativeType: CooperativeType;
    response: ApiResponse<CooperativeTypeTranslationResponse[]>;
  }>()
);

export const getAllForTypeFailure = createAction(
  '[Cooperative Type Translations] Get All For Type Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get Translations By Locale
export const getByLocale = createAction(
  '[Cooperative Type Translations] Get By Locale',
  props<{ locale: string; page: number; size: number }>()
);

export const getByLocaleSuccess = createAction(
  '[Cooperative Type Translations] Get By Locale Success',
  props<{
    locale: string;
    response: ApiResponse<PageResponse<CooperativeTypeTranslationResponse>>;
  }>()
);

export const getByLocaleFailure = createAction(
  '[Cooperative Type Translations] Get By Locale Failure',
  props<{ error: CooperativeValidationError }>()
);

// Delete Type Translation
export const deleteTypeTranslation = createAction(
  '[Cooperative Type Translations] Delete Type Translation',
  props<{
    cooperativeType: CooperativeType;
    locale: string;
  }>()
);

export const deleteTypeTranslationSuccess = createAction(
  '[Cooperative Type Translations] Delete Type Translation Success',
  props<{
    cooperativeType: CooperativeType;
    locale: string;
    response: ApiResponse<void>;
  }>()
);

export const deleteTypeTranslationFailure = createAction(
  '[Cooperative Type Translations] Delete Type Translation Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get All Types For Locale
export const getAllTypesForLocale = createAction(
  '[Cooperative Type Translations] Get All Types For Locale',
  props<{ locale: string }>()
);

export const getAllTypesForLocaleSuccess = createAction(
  '[Cooperative Type Translations] Get All Types For Locale Success',
  props<{
    locale: string;
    response: ApiResponse<Record<CooperativeType, CooperativeTypeTranslationResponse>>;
  }>()
);

export const getAllTypesForLocaleFailure = createAction(
  '[Cooperative Type Translations] Get All Types For Locale Failure',
  props<{ error: CooperativeValidationError }>()
);

// Clear Errors
export const clearErrors = createAction(
  '[Cooperative Type Translations] Clear Errors'
);
