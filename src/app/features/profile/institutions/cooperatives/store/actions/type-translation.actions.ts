import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ApiResponse,
  CooperativeType,
  CooperativeTypeTranslationDto,
  CooperativeTypeTranslationResponse,
  PageResponse,
} from '../../types';
import { CooperativeValidationError } from '../state';

/**
 * Actions for managing cooperative type translations
 */
export const CooperativeTypeTranslationActions = createActionGroup({
  source: 'Cooperative Type Translations',
  events: {
    // Create or Update Type Translation
    'Create Or Update Type Translation': props<{
      translation: CooperativeTypeTranslationDto;
    }>(),
    'Create Or Update Success': props<{
      response: ApiResponse<CooperativeTypeTranslationResponse>;
    }>(),
    'Create Or Update Failure': props<{ error: CooperativeValidationError }>(),

    // Get Type Translation By ID
    'Get Type Translation': props<{ id: string }>(),
    'Get Type Translation Success': props<{
      response: ApiResponse<CooperativeTypeTranslationResponse>;
    }>(),
    'Get Type Translation Failure': props<{
      error: CooperativeValidationError;
    }>(),

    // Get By Type And Locale
    'Get Type Translation By Type And Locale': props<{
      type: CooperativeType;
      locale: string;
    }>(),
    'Get By Type And Locale Success': props<{
      response: ApiResponse<CooperativeTypeTranslationResponse>;
    }>(),
    'Get By Type And Locale Failure': props<{
      error: CooperativeValidationError;
    }>(),

    // Get All Translations For Type
    'Get All For Type': props<{ type: CooperativeType }>(),
    'Get All For Type Success': props<{
      type: CooperativeType;
      response: ApiResponse<CooperativeTypeTranslationResponse[]>;
    }>(),
    'Get All For Type Failure': props<{ error: CooperativeValidationError }>(),

    // Get Translations By Locale
    'Get By Locale': props<{ locale: string; page: number; size: number }>(),
    'Get By Locale Success': props<{
      locale: string;
      response: ApiResponse<PageResponse<CooperativeTypeTranslationResponse>>;
    }>(),
    'Get By Locale Failure': props<{ error: CooperativeValidationError }>(),

    // Delete Type Translation
    'Delete Type Translation': props<{
      type: CooperativeType;
      locale: string;
    }>(),
    'Delete Type Translation Success': props<{
      type: CooperativeType;
      locale: string;
      response: ApiResponse<void>;
    }>(),
    'Delete Type Translation Failure': props<{
      error: CooperativeValidationError;
    }>(),

    // Get All Types With Translations For Locale
    'Get All Types For Locale': props<{ locale: string }>(),
    'Get All Types For Locale Success': props<{
      locale: string;
      response: ApiResponse<
        Record<CooperativeType, CooperativeTypeTranslationResponse>
      >;
    }>(),
    'Get All Types For Locale Failure': props<{
      error: CooperativeValidationError;
    }>(),

    // Clear Errors
    'Clear Errors': emptyProps(),
  },
});
