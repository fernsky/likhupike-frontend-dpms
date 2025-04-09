import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CitizenValidationError, PaginationState } from './citizen.state';
import * as CitizenSelectors from './citizen.selectors';
import { CitizenActions } from './citizen.actions';
import {
  CitizenResponse,
  CitizenSummaryResponse,
  CitizenSearchFilters,
  CitizenStateUpdateDto,
  CreateCitizenDto,
  DocumentStateUpdateDto,
  DocumentType,
  UpdateCitizenDto,
} from '../types';

/**
 * Facade service providing a simplified API for components to interact with the citizen store.
 * This separates UI components from store implementation details.
 */
@Injectable({
  providedIn: 'root',
})
export class CitizenFacade {
  constructor(private store: Store) {}

  // ========== Selectors ==========

  // List view
  citizens$: Observable<CitizenSummaryResponse[]> = this.store.select(
    CitizenSelectors.selectCitizens
  );
  loading$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectCitizensLoading
  );
  pagination$: Observable<PaginationState> = this.store.select(
    CitizenSelectors.selectPagination
  );
  currentFilter$: Observable<CitizenSearchFilters> = this.store.select(
    CitizenSelectors.selectCurrentFilter
  );
  totalItems$: Observable<number> = this.store.select(
    CitizenSelectors.selectTotalItems
  );
  currentPage$: Observable<number> = this.store.select(
    CitizenSelectors.selectCurrentPage
  );
  pageSize$: Observable<number> = this.store.select(
    CitizenSelectors.selectPageSize
  );

  // Single citizen
  selectedCitizen$: Observable<CitizenResponse | null> = this.store.select(
    CitizenSelectors.selectSelectedCitizen
  );
  selectedCitizenId$: Observable<string | null> = this.store.select(
    CitizenSelectors.selectSelectedCitizenId
  );
  loadingSelected$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectLoadingSelected
  );
  selectedCitizenDocuments$ = this.store.select(
    CitizenSelectors.selectSelectedCitizenDocuments
  );

  // Operation states
  creating$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectCreating
  );
  updating$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectUpdating
  );
  deleting$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectDeleting
  );
  approving$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectApproving
  );
  processingStateChange$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectProcessingStateChange
  );
  processingDocumentStateChange$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectProcessingDocumentStateChange
  );
  isProcessingAny$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectIsProcessingAny
  );

  // Success/error states
  errors$: Observable<CitizenValidationError | null> = this.store.select(
    CitizenSelectors.selectErrors
  );
  createSuccess$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectCreateSuccess
  );
  updateSuccess$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectUpdateSuccess
  );
  deleteSuccess$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectDeleteSuccess
  );
  approveSuccess$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectApproveSuccess
  );
  stateChangeSuccess$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectStateChangeSuccess
  );
  documentStateChangeSuccess$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectDocumentStateChangeSuccess
  );

  // Form states
  hasUnsavedChanges$: Observable<boolean> = this.store.select(
    CitizenSelectors.selectHasUnsavedChanges
  );
  dirtyFields$: Observable<string[]> = this.store.select(
    CitizenSelectors.selectDirtyFields
  );

  // ========== Dispatch Methods ==========

  // CRUD operations
  createCitizen(citizenData: CreateCitizenDto): void {
    this.store.dispatch(CitizenActions.createCitizen({ request: citizenData }));
  }

  loadCitizen(id: string): void {
    this.store.dispatch(CitizenActions.loadCitizen({ id }));
  }

  updateCitizen(id: string, citizenData: UpdateCitizenDto): void {
    this.store.dispatch(
      CitizenActions.updateCitizen({ id, request: citizenData })
    );
  }

  deleteCitizen(id: string): void {
    this.store.dispatch(CitizenActions.deleteCitizen({ id }));
  }

  approveCitizen(id: string): void {
    this.store.dispatch(CitizenActions.approveCitizen({ id }));
  }

  // List operations
  loadCitizens(filter: CitizenSearchFilters): void {
    this.store.dispatch(CitizenActions.loadCitizens({ filter }));
  }

  filterChange(filter: Partial<CitizenSearchFilters>): void {
    this.store.dispatch(CitizenActions.filterChange({ filter }));
  }

  setPage(pageIndex: number, pageSize: number): void {
    this.store.dispatch(CitizenActions.setPage({ pageIndex, pageSize }));
  }

  resetFilters(): void {
    this.store.dispatch(CitizenActions.resetFilters());
  }

  // Document operations
  uploadDocument(id: string, documentType: DocumentType, file: File): void {
    this.store.dispatch(
      CitizenActions.uploadDocument({ id, documentType, file })
    );
  }

  isUploadingDocument(documentType: DocumentType): Observable<boolean> {
    return this.store.select(CitizenSelectors.selectUploadingDocument, {
      documentType,
    });
  }

  isUploadSuccessful(documentType: DocumentType): Observable<boolean> {
    return this.store.select(CitizenSelectors.selectUploadSuccess, {
      documentType,
    });
  }

  // State changes
  updateCitizenState(id: string, stateUpdate: CitizenStateUpdateDto): void {
    this.store.dispatch(CitizenActions.updateCitizenState({ id, stateUpdate }));
  }

  updateDocumentState(
    id: string,
    documentType: DocumentType,
    stateUpdate: DocumentStateUpdateDto
  ): void {
    this.store.dispatch(
      CitizenActions.updateDocumentState({ id, documentType, stateUpdate })
    );
  }

  // Form state tracking
  markFieldDirty(fieldName: string): void {
    this.store.dispatch(CitizenActions.markFieldDirty({ fieldName }));
  }

  clearDirtyFields(): void {
    this.store.dispatch(CitizenActions.clearDirtyFields());
  }

  setUnsavedChanges(hasUnsavedChanges: boolean): void {
    this.store.dispatch(
      CitizenActions.setUnsavedChanges({ hasUnsavedChanges })
    );
  }

  // Misc
  setSelectedCitizenId(id: string | null): void {
    this.store.dispatch(CitizenActions.setSelectedCitizenID({ id }));
  }

  clearSelectedCitizen(): void {
    this.store.dispatch(CitizenActions.clearSelectedCitizen());
  }

  refreshCitizens(): void {
    this.store.dispatch(CitizenActions.refreshCitizens());
  }

  applyUrlFilters(urlParams: Record<string, string>): void {
    this.store.dispatch(CitizenActions.applyURLFilters({ urlParams }));
  }

  // Reset status actions
  resetCreateStatus(): void {
    this.store.dispatch(CitizenActions.resetCreateStatus());
  }

  resetUpdateStatus(): void {
    this.store.dispatch(CitizenActions.resetUpdateStatus());
  }

  resetDeleteStatus(): void {
    this.store.dispatch(CitizenActions.resetDeleteStatus());
  }

  resetApproveStatus(): void {
    this.store.dispatch(CitizenActions.resetApproveStatus());
  }

  resetUploadStatus(documentType: DocumentType): void {
    this.store.dispatch(CitizenActions.resetUploadStatus({ documentType }));
  }

  resetStateChangeStatus(): void {
    this.store.dispatch(CitizenActions.resetStateChangeStatus());
  }

  resetDocumentStateChangeStatus(): void {
    this.store.dispatch(CitizenActions.resetDocumentStateChangeStatus());
  }
}
