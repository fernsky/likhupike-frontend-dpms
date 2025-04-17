import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ApiResponse,
  ContentStatus,
  CooperativeTranslationResponse,
  CreateCooperativeTranslationDto,
  UpdateCooperativeTranslationDto,
} from '../../types';
import { CooperativeValidationError } from '../state';

/**
 * Actions for managing cooperative translations
 */
export const CooperativeTranslationActions = createActionGroup({
  source: 'Cooperative Translations',
  events: {
    // Load Translations
    'Load Translations': props<{ cooperativeId: string }>(),
    'Load Translations Success': props<{
      cooperativeId: string;
      response: ApiResponse<CooperativeTranslationResponse[]>;
    }>(),
    'Load Translations Failure': props<{ error: CooperativeValidationError }>(),

    // Load Single Translation
    'Load Translation': props<{
      cooperativeId: string;
      translationId: string;
    }>(),
    'Load Translation By Locale': props<{
      cooperativeId: string;
      locale: string;
    }>(),
    'Load Translation Success': props<{
      response: ApiResponse<CooperativeTranslationResponse>;
    }>(),
    'Load Translation Failure': props<{ error: CooperativeValidationError }>(),

    // Create Translation
    'Create Translation': props<{
      cooperativeId: string;
      translation: CreateCooperativeTranslationDto;
    }>(),
    'Create Translation Success': props<{
      cooperativeId: string;
      response: ApiResponse<CooperativeTranslationResponse>;
    }>(),
    'Create Translation Failure': props<{
      error: CooperativeValidationError;
    }>(),
    'Reset Create Status': emptyProps(),

    // Update Translation
    'Update Translation': props<{
      cooperativeId: string;
      translationId: string;
      translation: UpdateCooperativeTranslationDto;
    }>(),
    'Update Translation Success': props<{
      cooperativeId: string;
      response: ApiResponse<CooperativeTranslationResponse>;
    }>(),
    'Update Translation Failure': props<{
      error: CooperativeValidationError;
    }>(),
    'Reset Update Status': emptyProps(),

    // Delete Translation
    'Delete Translation': props<{
      cooperativeId: string;
      translationId: string;
    }>(),
    'Delete Translation Success': props<{
      cooperativeId: string;
      translationId: string;
      response: ApiResponse<void>;
    }>(),
    'Delete Translation Failure': props<{
      error: CooperativeValidationError;
    }>(),
    'Reset Delete Status': emptyProps(),

    // Update Translation Status
    'Update Translation Status': props<{
      cooperativeId: string;
      translationId: string;
      status: ContentStatus;
    }>(),
    'Update Status Success': props<{
      cooperativeId: string;
      response: ApiResponse<CooperativeTranslationResponse>;
    }>(),
    'Update Status Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Status Update': emptyProps(),

    // Form State Management
    'Mark Field Dirty': props<{ fieldName: string }>(),
    'Clear Dirty Fields': emptyProps(),
    'Set Unsaved Changes': props<{ hasUnsavedChanges: boolean }>(),
    'Clear Errors': emptyProps(),

    // Set Selected Translation
    'Select Translation': props<{ id: string | null }>(),
  },
});
