import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CooperativeResponse,
  CooperativeStatus,
  CooperativeType,
  PageResponse,
} from '../../types';
import { CooperativeFilter, CooperativeValidationError } from '../state';
import { ApiResponse } from '@app/core/api/types/api-response.type';

/**
 * Actions for cooperative search functionality
 * Strictly aligned with CooperativeSearchService capabilities
 */
export const CooperativeSearchActions = createActionGroup({
  source: 'Cooperative Search',
  events: {
    // Search Cooperatives By Name
    'Search By Name': props<{
      nameQuery: string;
      page: number;
      size: number;
    }>(),
    'Search By Name Success': props<{
      response: ApiResponse<PageResponse<CooperativeResponse>>;
    }>(),
    'Search By Name Failure': props<{ error: CooperativeValidationError }>(),

    // Get Cooperatives By Type
    'Get By Type': props<{
      type: CooperativeType;
      page: number;
      size: number;
    }>(),
    'Get By Type Success': props<{
      type: CooperativeType;
      response: ApiResponse<PageResponse<CooperativeResponse>>;
    }>(),
    'Get By Type Failure': props<{ error: CooperativeValidationError }>(),

    // Get Cooperatives By Status
    'Get By Status': props<{
      status: CooperativeStatus;
      page: number;
      size: number;
    }>(),
    'Get By Status Success': props<{
      status: CooperativeStatus;
      response: ApiResponse<PageResponse<CooperativeResponse>>;
    }>(),
    'Get By Status Failure': props<{ error: CooperativeValidationError }>(),

    // Get Cooperatives By Ward
    'Get By Ward': props<{ ward: number; page: number; size: number }>(),
    'Get By Ward Success': props<{
      ward: number;
      response: ApiResponse<PageResponse<CooperativeResponse>>;
    }>(),
    'Get By Ward Failure': props<{ error: CooperativeValidationError }>(),

    // Find Cooperatives Near Location
    'Find Near': props<{
      longitude: number;
      latitude: number;
      distanceInMeters: number;
      page: number;
      size: number;
    }>(),
    'Find Near Success': props<{
      response: ApiResponse<PageResponse<CooperativeResponse>>;
    }>(),
    'Find Near Failure': props<{ error: CooperativeValidationError }>(),

    // Get Cooperative Statistics
    'Get Statistics By Type': emptyProps(),
    'Get Statistics By Type Success': props<{
      response: ApiResponse<Record<CooperativeType, number>>;
    }>(),
    'Get Statistics By Type Failure': props<{
      error: CooperativeValidationError;
    }>(),

    'Get Statistics By Ward': emptyProps(),
    'Get Statistics By Ward Success': props<{
      response: ApiResponse<Record<number, number>>;
    }>(),
    'Get Statistics By Ward Failure': props<{
      error: CooperativeValidationError;
    }>(),

    // Filter state management
    'Filter Change': props<{ filter: CooperativeFilter }>(),
    'Reset Filters': emptyProps(),

    // Clear Errors
    'Clear Errors': emptyProps(),
  },
});
