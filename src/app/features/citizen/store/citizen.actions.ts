import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CitizenResponse,
  CitizenSearchFilters,
  CitizenSummaryResponse,
  CreateCitizenDto,
  DocumentType,
  UpdateCitizenDto,
  CitizenStateUpdateDto,
  DocumentStateUpdateDto,
  DocumentUploadResponse,
} from '../types';
import { PaginationState, CitizenValidationError } from './citizen.state';
import { ApiResponse } from '@app/features/user-management/models/api.interface';

export const CitizenActions = createActionGroup({
  source: 'Citizen',
  events: {
    // Create citizen actions
    'Create Citizen': props<{ request: CreateCitizenDto }>(),
    'Create Citizen Success': props<{
      response: ApiResponse<CitizenResponse>;
    }>(),
    'Create Citizen Failure': props<{ error: CitizenValidationError }>(),
    'Reset Create Status': emptyProps(),

    // Load citizens (list view)
    'Load Citizens': props<{ filter: CitizenSearchFilters }>(),
    'Load Citizens Success': props<{
      response: ApiResponse<CitizenSummaryResponse[]>;
      meta: PaginationState;
    }>(),
    'Load Citizens Failure': props<{ error: CitizenValidationError }>(),

    // Load single citizen
    'Load Citizen': props<{ id: string }>(),
    'Load Citizen Success': props<{ response: ApiResponse<CitizenResponse> }>(),
    'Load Citizen Failure': props<{ error: CitizenValidationError }>(),
    'Clear Selected Citizen': emptyProps(),

    // Update citizen
    'Update Citizen': props<{ id: string; request: UpdateCitizenDto }>(),
    'Update Citizen Success': props<{
      response: ApiResponse<CitizenResponse>;
    }>(),
    'Update Citizen Failure': props<{ error: CitizenValidationError }>(),
    'Reset Update Status': emptyProps(),

    // Delete citizen
    'Delete Citizen': props<{ id: string }>(),
    'Delete Citizen Success': props<{
      response: ApiResponse<CitizenResponse>;
      id: string;
    }>(),
    'Delete Citizen Failure': props<{ error: CitizenValidationError }>(),
    'Reset Delete Status': emptyProps(),

    // Approve citizen
    'Approve Citizen': props<{ id: string }>(),
    'Approve Citizen Success': props<{
      response: ApiResponse<CitizenResponse>;
    }>(),
    'Approve Citizen Failure': props<{ error: CitizenValidationError }>(),
    'Reset Approve Status': emptyProps(),

    // Upload documents
    'Upload Document': props<{
      id: string;
      documentType: DocumentType;
      file: File;
    }>(),
    'Upload Document Success': props<{
      response: ApiResponse<DocumentUploadResponse>;
      documentType: DocumentType;
    }>(),
    'Upload Document Failure': props<{
      error: CitizenValidationError;
      documentType: DocumentType;
    }>(),
    'Reset Upload Status': props<{ documentType: DocumentType }>(),

    // Update citizen state
    'Update Citizen State': props<{
      id: string;
      stateUpdate: CitizenStateUpdateDto;
    }>(),
    'Update Citizen State Success': props<{
      response: ApiResponse<CitizenResponse>;
    }>(),
    'Update Citizen State Failure': props<{ error: CitizenValidationError }>(),
    'Reset State Change Status': emptyProps(),

    // Update document state
    'Update Document State': props<{
      id: string;
      documentType: DocumentType;
      stateUpdate: DocumentStateUpdateDto;
    }>(),
    'Update Document State Success': props<{
      response: ApiResponse<CitizenResponse>;
    }>(),
    'Update Document State Failure': props<{ error: CitizenValidationError }>(),
    'Reset Document State Change Status': emptyProps(),

    // Filtering and pagination actions
    'Filter Change': props<{ filter: Partial<CitizenSearchFilters> }>(),
    'Set Page': props<{ pageIndex: number; pageSize: number }>(),
    'Reset Filters': emptyProps(),

    // Form state management
    'Mark Field Dirty': props<{ fieldName: string }>(),
    'Clear Dirty Fields': emptyProps(),
    'Set Unsaved Changes': props<{ hasUnsavedChanges: boolean }>(),

    // Misc actions
    'Set Selected Citizen ID': props<{ id: string | null }>(),
    'Refresh Citizens': emptyProps(),
    'Apply URL Filters': props<{ urlParams: Record<string, string> }>(),
  },
});
