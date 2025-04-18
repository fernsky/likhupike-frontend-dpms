import { createAction, props } from '@ngrx/store';
import {
  CooperativeResponse,
  CooperativeStatus,
  CooperativeType,
  PageResponse,
} from '../../types';
import { CooperativeFilter, CooperativeValidationError } from '../state';
import { ApiResponse } from '@app/core/api/types/api-response.type';

// Search Cooperatives By Name
export const searchByName = createAction(
  '[Cooperative Search] Search By Name',
  props<{
    nameQuery: string;
    page: number;
    size: number;
  }>()
);

export const searchByNameSuccess = createAction(
  '[Cooperative Search] Search By Name Success',
  props<{
    response: ApiResponse<PageResponse<CooperativeResponse>>;
  }>()
);

export const searchByNameFailure = createAction(
  '[Cooperative Search] Search By Name Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get Cooperatives By Type
export const getByType = createAction(
  '[Cooperative Search] Get By Type',
  props<{
    cooperativeType: CooperativeType;
    page: number;
    size: number;
  }>()
);

export const getByTypeSuccess = createAction(
  '[Cooperative Search] Get By Type Success',
  props<{
    cooperativeType: CooperativeType;
    response: ApiResponse<PageResponse<CooperativeResponse>>;
  }>()
);

export const getByTypeFailure = createAction(
  '[Cooperative Search] Get By Type Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get Cooperatives By Status
export const getByStatus = createAction(
  '[Cooperative Search] Get By Status',
  props<{
    status: CooperativeStatus;
    page: number;
    size: number;
  }>()
);

export const getByStatusSuccess = createAction(
  '[Cooperative Search] Get By Status Success',
  props<{
    status: CooperativeStatus;
    response: ApiResponse<PageResponse<CooperativeResponse>>;
  }>()
);

export const getByStatusFailure = createAction(
  '[Cooperative Search] Get By Status Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get Cooperatives By Ward
export const getByWard = createAction(
  '[Cooperative Search] Get By Ward',
  props<{ ward: number; page: number; size: number }>()
);

export const getByWardSuccess = createAction(
  '[Cooperative Search] Get By Ward Success',
  props<{
    ward: number;
    response: ApiResponse<PageResponse<CooperativeResponse>>;
  }>()
);

export const getByWardFailure = createAction(
  '[Cooperative Search] Get By Ward Failure',
  props<{ error: CooperativeValidationError }>()
);

// Find Cooperatives Near Location
export const findNear = createAction(
  '[Cooperative Search] Find Near',
  props<{
    longitude: number;
    latitude: number;
    distanceInMeters: number;
    page: number;
    size: number;
  }>()
);

export const findNearSuccess = createAction(
  '[Cooperative Search] Find Near Success',
  props<{
    response: ApiResponse<PageResponse<CooperativeResponse>>;
  }>()
);

export const findNearFailure = createAction(
  '[Cooperative Search] Find Near Failure',
  props<{ error: CooperativeValidationError }>()
);

// Get Cooperative Statistics
export const getStatisticsByType = createAction(
  '[Cooperative Search] Get Statistics By Type'
);

export const getStatisticsByTypeSuccess = createAction(
  '[Cooperative Search] Get Statistics By Type Success',
  props<{
    response: ApiResponse<Record<CooperativeType, number>>;
  }>()
);

export const getStatisticsByTypeFailure = createAction(
  '[Cooperative Search] Get Statistics By Type Failure',
  props<{
    error: CooperativeValidationError;
  }>()
);

export const getStatisticsByWard = createAction(
  '[Cooperative Search] Get Statistics By Ward'
);

export const getStatisticsByWardSuccess = createAction(
  '[Cooperative Search] Get Statistics By Ward Success',
  props<{
    response: ApiResponse<Record<number, number>>;
  }>()
);

export const getStatisticsByWardFailure = createAction(
  '[Cooperative Search] Get Statistics By Ward Failure',
  props<{
    error: CooperativeValidationError;
  }>()
);

// Filter state management
export const filterChange = createAction(
  '[Cooperative Search] Filter Change',
  props<{ filter: CooperativeFilter }>()
);

export const resetFilters = createAction(
  '[Cooperative Search] Reset Filters'
);

// Clear Errors
export const clearErrors = createAction(
  '[Cooperative Search] Clear Errors'
);
