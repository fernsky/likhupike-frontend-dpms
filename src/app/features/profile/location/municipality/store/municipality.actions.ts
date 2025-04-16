import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { 
  CreateMunicipalityDto, 
  MunicipalityResponse, 
  UpdateMunicipalityGeoLocationDto, 
  UpdateMunicipalityInfoDto 
} from '../types';
import { ApiResponse } from '@app/core/api/types/api-response.type';
import { MunicipalityValidationError } from './municipality.state';

export const MunicipalityActions = createActionGroup({
  source: 'Municipality',
  events: {
    // Load municipality
    'Load Municipality': emptyProps(),
    'Load Municipality Success': props<{ 
      response: ApiResponse<MunicipalityResponse> 
    }>(),
    'Load Municipality Failure': props<{ 
      error: MunicipalityValidationError 
    }>(),
    
    // Create municipality
    'Create Municipality': props<{ 
      request: CreateMunicipalityDto 
    }>(),
    'Create Municipality Success': props<{ 
      response: ApiResponse<MunicipalityResponse> 
    }>(),
    'Create Municipality Failure': props<{ 
      error: MunicipalityValidationError 
    }>(),
    'Reset Create Status': emptyProps(),
    
    // Update municipality basic info
    'Update Municipality Info': props<{ 
      request: UpdateMunicipalityInfoDto 
    }>(),
    'Update Municipality Info Success': props<{ 
      response: ApiResponse<MunicipalityResponse> 
    }>(),
    'Update Municipality Info Failure': props<{ 
      error: MunicipalityValidationError 
    }>(),
    'Reset Update Status': emptyProps(),
    
    // Update municipality geo-location
    'Update Municipality Geo Location': props<{ 
      request: UpdateMunicipalityGeoLocationDto 
    }>(),
    'Update Municipality Geo Location Success': props<{ 
      response: ApiResponse<MunicipalityResponse> 
    }>(),
    'Update Municipality Geo Location Failure': props<{ 
      error: MunicipalityValidationError 
    }>(),
    'Reset Update Geo Status': emptyProps(),
    
    // Form state management
    'Mark Field Dirty': props<{ fieldName: string }>(),
    'Clear Dirty Fields': emptyProps(),
    'Set Unsaved Changes': props<{ hasUnsavedChanges: boolean }>(),
  },
});
