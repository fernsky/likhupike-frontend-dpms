import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  ApiResponse,
  CooperativeResponse,
  CooperativeStatus,
  CreateCooperativeDto,
  PageResponse,
  UpdateCooperativeDto,
} from '../../types';
import { CooperativeValidationError } from '../state';

/**
 * Actions for managing cooperative entities
 */
export const CooperativeActions = createActionGroup({
  source: 'Cooperatives',
  events: {
    // Load All Cooperatives
    'Load Cooperatives': props<{ page: number; size: number }>(),
    'Load Cooperatives Success': props<{
      response: ApiResponse<PageResponse<CooperativeResponse>>;
    }>(),
    'Load Cooperatives Failure': props<{ error: CooperativeValidationError }>(),

    // Load Single Cooperative
    'Load Cooperative': props<{ id: string }>(),
    'Load Cooperative By Code': props<{ code: string }>(),
    'Load Cooperative Success': props<{
      response: ApiResponse<CooperativeResponse>;
    }>(),
    'Load Cooperative Failure': props<{ error: CooperativeValidationError }>(),

    // Create Cooperative
    'Create Cooperative': props<{ cooperative: CreateCooperativeDto }>(),
    'Create Cooperative Success': props<{
      response: ApiResponse<CooperativeResponse>;
    }>(),
    'Create Cooperative Failure': props<{
      error: CooperativeValidationError;
    }>(),
    'Reset Create Status': emptyProps(),

    // Update Cooperative
    'Update Cooperative': props<{
      id: string;
      cooperative: UpdateCooperativeDto;
    }>(),
    'Update Cooperative Success': props<{
      response: ApiResponse<CooperativeResponse>;
    }>(),
    'Update Cooperative Failure': props<{
      error: CooperativeValidationError;
    }>(),
    'Reset Update Status': emptyProps(),

    // Delete Cooperative
    'Delete Cooperative': props<{ id: string }>(),
    'Delete Cooperative Success': props<{
      id: string;
      response: ApiResponse<void>;
    }>(),
    'Delete Cooperative Failure': props<{
      error: CooperativeValidationError;
    }>(),
    'Reset Delete Status': emptyProps(),

    // Change Cooperative Status
    'Change Cooperative Status': props<{
      id: string;
      status: CooperativeStatus;
    }>(),
    'Change Status Success': props<{
      response: ApiResponse<CooperativeResponse>;
    }>(),
    'Change Status Failure': props<{ error: CooperativeValidationError }>(),
    'Reset Status Change': emptyProps(),

    // Form State Management
    'Mark Field Dirty': props<{ fieldName: string }>(),
    'Clear Dirty Fields': emptyProps(),
    'Set Unsaved Changes': props<{ hasUnsavedChanges: boolean }>(),
    'Clear Errors': emptyProps(),

    // Set Selected Cooperative
    'Select Cooperative': props<{ id: string | null }>(),

    // Change Pagination
    'Set Page': props<{ page: number }>(),
    'Set Page Size': props<{ size: number }>(),

    // Change Sorting
    'Set Sort': props<{ sortBy: string; sortDirection: 'ASC' | 'DESC' }>(),
  },
});
