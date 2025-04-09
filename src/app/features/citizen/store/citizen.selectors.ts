import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CitizenState } from './citizen.state';
import { DocumentType } from '../types';

// Feature selector
export const selectCitizenState =
  createFeatureSelector<CitizenState>('citizen');

// List view selectors
export const selectCitizens = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.citizens
);

export const selectCitizensLoading = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.loading
);

export const selectPagination = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.pagination
);

export const selectCurrentFilter = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.filter
);

export const selectLastUpdated = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.lastUpdated
);

// Single citizen view selectors
export const selectSelectedCitizen = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.selectedCitizen
);

export const selectSelectedCitizenId = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.selectedCitizenId
);

export const selectLoadingSelected = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.loadingSelected
);

// CRUD operation state selectors
export const selectCreating = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.creating
);

export const selectUpdating = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.updating
);

export const selectDeleting = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.deleting
);

export const selectApproving = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.approving
);

export const selectUploadingDocument = createSelector(
  selectCitizenState,
  (state: CitizenState, props: { documentType: DocumentType }) =>
    state.uploadingDocument[props.documentType]
);

export const selectProcessingStateChange = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.processingStateChange
);

export const selectProcessingDocumentStateChange = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.processingDocumentStateChange
);

// Success/error selectors
export const selectErrors = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.errors
);

export const selectCreateSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.createSuccess
);

export const selectUpdateSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.updateSuccess
);

export const selectDeleteSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.deleteSuccess
);

export const selectApproveSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.approveSuccess
);

export const selectUploadSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState, props: { documentType: DocumentType }) =>
    state.uploadSuccess[props.documentType]
);

export const selectStateChangeSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.stateChangeSuccess
);

export const selectDocumentStateChangeSuccess = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.documentStateChangeSuccess
);

// Form state selectors
export const selectHasUnsavedChanges = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.hasUnsavedChanges
);

export const selectDirtyFields = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.dirtyFields
);

// Derived selectors
export const selectSelectedCitizenDocuments = createSelector(
  selectSelectedCitizen,
  (citizen) => citizen?.documents
);

export const selectIsProcessingAny = createSelector(
  selectCitizenState,
  (state: CitizenState) =>
    state.creating ||
    state.updating ||
    state.deleting ||
    state.approving ||
    state.processingStateChange ||
    state.processingDocumentStateChange ||
    Object.values(state.uploadingDocument).some((uploading) => uploading)
);

export const selectIsSelectionMode = createSelector(
  selectCitizenState,
  (state: CitizenState) => state.selectedCitizenId !== null
);

export const selectTotalItems = createSelector(
  selectPagination,
  (pagination) => pagination.totalElements
);

export const selectCurrentPage = createSelector(
  selectPagination,
  (pagination) => pagination.currentPage
);

export const selectPageSize = createSelector(
  selectPagination,
  (pagination) => pagination.pageSize
);
