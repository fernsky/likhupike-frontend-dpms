import { createAction, props } from '@ngrx/store';
import {
  ApiResponse,
  CooperativeResponse,
  CooperativeStatus,
  CreateCooperativeDto,
  PageResponse,
  UpdateCooperativeDto,
} from '../../types';
import { CooperativeValidationError } from '../state';

// Load All Cooperatives
export const loadCooperatives = createAction(
  '[Cooperatives] Load Cooperatives',
  props<{ page: number; size: number }>()
);

export const loadCooperativesSuccess = createAction(
  '[Cooperatives] Load Cooperatives Success',
  props<{
    response: ApiResponse<PageResponse<CooperativeResponse>>;
  }>()
);

export const loadCooperativesFailure = createAction(
  '[Cooperatives] Load Cooperatives Failure',
  props<{ error: CooperativeValidationError }>()
);

// Load Single Cooperative
export const loadCooperative = createAction(
  '[Cooperatives] Load Cooperative',
  props<{ id: string }>()
);

export const loadCooperativeByCode = createAction(
  '[Cooperatives] Load Cooperative By Code',
  props<{ code: string }>()
);

export const loadCooperativeSuccess = createAction(
  '[Cooperatives] Load Cooperative Success',
  props<{
    response: ApiResponse<CooperativeResponse>;
  }>()
);

export const loadCooperativeFailure = createAction(
  '[Cooperatives] Load Cooperative Failure',
  props<{ error: CooperativeValidationError }>()
);

// Create Cooperative
export const createCooperative = createAction(
  '[Cooperatives] Create Cooperative',
  props<{ cooperative: CreateCooperativeDto }>()
);

export const createCooperativeSuccess = createAction(
  '[Cooperatives] Create Cooperative Success',
  props<{
    response: ApiResponse<CooperativeResponse>;
  }>()
);

export const createCooperativeFailure = createAction(
  '[Cooperatives] Create Cooperative Failure',
  props<{
    error: CooperativeValidationError;
  }>()
);

export const resetCreateStatus = createAction(
  '[Cooperatives] Reset Create Status'
);

// Update Cooperative
export const updateCooperative = createAction(
  '[Cooperatives] Update Cooperative',
  props<{
    id: string;
    cooperative: UpdateCooperativeDto;
  }>()
);

export const updateCooperativeSuccess = createAction(
  '[Cooperatives] Update Cooperative Success',
  props<{
    response: ApiResponse<CooperativeResponse>;
  }>()
);

export const updateCooperativeFailure = createAction(
  '[Cooperatives] Update Cooperative Failure',
  props<{
    error: CooperativeValidationError;
  }>()
);

export const resetUpdateStatus = createAction(
  '[Cooperatives] Reset Update Status'
);

// Delete Cooperative
export const deleteCooperative = createAction(
  '[Cooperatives] Delete Cooperative',
  props<{ id: string }>()
);

export const deleteCooperativeSuccess = createAction(
  '[Cooperatives] Delete Cooperative Success',
  props<{
    id: string;
    response: ApiResponse<void>;
  }>()
);

export const deleteCooperativeFailure = createAction(
  '[Cooperatives] Delete Cooperative Failure',
  props<{
    error: CooperativeValidationError;
  }>()
);

export const resetDeleteStatus = createAction(
  '[Cooperatives] Reset Delete Status'
);

// Change Cooperative Status
export const changeCooperativeStatus = createAction(
  '[Cooperatives] Change Cooperative Status',
  props<{
    id: string;
    status: CooperativeStatus;
  }>()
);

export const changeStatusSuccess = createAction(
  '[Cooperatives] Change Status Success',
  props<{
    response: ApiResponse<CooperativeResponse>;
  }>()
);

export const changeStatusFailure = createAction(
  '[Cooperatives] Change Status Failure',
  props<{ error: CooperativeValidationError }>()
);

export const resetStatusChange = createAction(
  '[Cooperatives] Reset Status Change'
);

// Form State Management
export const markFieldDirty = createAction(
  '[Cooperatives] Mark Field Dirty',
  props<{ fieldName: string }>()
);

export const clearDirtyFields = createAction(
  '[Cooperatives] Clear Dirty Fields'
);

export const setUnsavedChanges = createAction(
  '[Cooperatives] Set Unsaved Changes',
  props<{ hasUnsavedChanges: boolean }>()
);

export const clearErrors = createAction(
  '[Cooperatives] Clear Errors'
);

// Set Selected Cooperative
export const selectCooperative = createAction(
  '[Cooperatives] Select Cooperative',
  props<{ id: string | null }>()
);

// Change Pagination
export const setPage = createAction(
  '[Cooperatives] Set Page',
  props<{ page: number }>()
);

export const setPageSize = createAction(
  '[Cooperatives] Set Page Size',
  props<{ size: number }>()
);

// Change Sorting
export const setSort = createAction(
  '[Cooperatives] Set Sort',
  props<{ sortBy: string; sortDirection: 'ASC' | 'DESC' }>()
);
