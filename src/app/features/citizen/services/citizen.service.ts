import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CreateCitizenDto,
  UpdateCitizenDto,
  CitizenResponse,
  CitizenSummaryResponse,
  CitizenSearchFilters,
  CitizenState,
  DocumentState,
  DocumentType,
  CitizenStateUpdateDto,
  DocumentStateUpdateDto,
  DocumentUploadResponse,
} from '../types';
import { ApiResponse } from '@app/features/user-management/models/api.interface';

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  private readonly apiUrl = `${environment.apiUrl}/admin/citizens`;
  private readonly stateApiUrl = `${environment.apiUrl}/admin/citizen-state`;

  constructor(private http: HttpClient) {}

  // ------------- Citizen Management Endpoints -------------

  /**
   * Creates a new citizen record
   * @param createCitizenDto - Data for creating a new citizen
   * @returns Observable with complete API response
   */
  createCitizen(
    createCitizenDto: CreateCitizenDto
  ): Observable<ApiResponse<CitizenResponse>> {
    return this.http.post<ApiResponse<CitizenResponse>>(
      `${this.apiUrl}`,
      createCitizenDto
    );
  }

  /**
   * Updates an existing citizen record
   * @param id - Unique identifier of the citizen to update
   * @param updateCitizenDto - Data for updating the citizen
   * @returns Observable with complete API response
   */
  updateCitizen(
    id: string,
    updateCitizenDto: UpdateCitizenDto
  ): Observable<ApiResponse<CitizenResponse>> {
    return this.http.put<ApiResponse<CitizenResponse>>(
      `${this.apiUrl}/${id}`,
      updateCitizenDto
    );
  }

  /**
   * Retrieves a citizen record by ID
   * @param id - Unique identifier of the citizen to retrieve
   * @returns Observable with complete API response
   */
  getCitizenById(id: string): Observable<ApiResponse<CitizenResponse>> {
    return this.http.get<ApiResponse<CitizenResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Approves a citizen record
   * @param id - Unique identifier of the citizen to approve
   * @returns Observable with complete API response
   */
  approveCitizen(id: string): Observable<ApiResponse<CitizenResponse>> {
    return this.http.post<ApiResponse<CitizenResponse>>(
      `${this.apiUrl}/${id}/approve`,
      {}
    );
  }

  /**
   * Deletes a citizen record
   * @param id - Unique identifier of the citizen to delete
   * @returns Observable with complete API response
   */
  deleteCitizen(id: string): Observable<ApiResponse<CitizenResponse>> {
    return this.http.delete<ApiResponse<CitizenResponse>>(
      `${this.apiUrl}/${id}`
    );
  }

  /**
   * Uploads a citizen's photo
   * @param id - Unique identifier of the citizen
   * @param photoFile - The photo file to upload
   * @returns Observable with complete API response
   */
  uploadCitizenPhoto(
    id: string,
    photoFile: File
  ): Observable<ApiResponse<DocumentUploadResponse>> {
    const formData = new FormData();
    formData.append('file', photoFile);

    return this.http.post<ApiResponse<DocumentUploadResponse>>(
      `${this.apiUrl}/${id}/photo`,
      formData
    );
  }

  /**
   * Uploads the front page of a citizen's citizenship certificate
   * @param id - Unique identifier of the citizen
   * @param documentFile - The document file to upload
   * @returns Observable with complete API response
   */
  uploadCitizenshipFront(
    id: string,
    documentFile: File
  ): Observable<ApiResponse<DocumentUploadResponse>> {
    const formData = new FormData();
    formData.append('file', documentFile);

    return this.http.post<ApiResponse<DocumentUploadResponse>>(
      `${this.apiUrl}/${id}/citizenship/front`,
      formData
    );
  }

  /**
   * Uploads the back page of a citizen's citizenship certificate
   * @param id - Unique identifier of the citizen
   * @param documentFile - The document file to upload
   * @returns Observable with complete API response
   */
  uploadCitizenshipBack(
    id: string,
    documentFile: File
  ): Observable<ApiResponse<DocumentUploadResponse>> {
    const formData = new FormData();
    formData.append('file', documentFile);

    return this.http.post<ApiResponse<DocumentUploadResponse>>(
      `${this.apiUrl}/${id}/citizenship/back`,
      formData
    );
  }

  // ------------- Citizen Search Endpoints -------------

  /**
   * Search for citizens with comprehensive filtering options
   * @param filters - The search criteria to apply
   * @returns Observable with complete API response
   */
  searchCitizens(
    filters: CitizenSearchFilters
  ): Observable<ApiResponse<CitizenSummaryResponse[]>> {
    let params = new HttpParams();

    // Add each filter parameter that is defined
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays specially
        if (Array.isArray(value)) {
          value.forEach((item) => {
            params = params.append(`${key}[]`, item);
          });
        } else {
          params = params.append(key, value.toString());
        }
      }
    });

    return this.http.get<ApiResponse<CitizenSummaryResponse[]>>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

  // ------------- Citizen State Management Endpoints -------------

  /**
   * Updates the state of a citizen in the verification workflow
   * @param id - ID of the citizen
   * @param stateUpdateDto - DTO with new state and optional note
   * @returns Observable with complete API response
   */
  updateCitizenState(
    id: string,
    stateUpdateDto: CitizenStateUpdateDto
  ): Observable<ApiResponse<CitizenResponse>> {
    return this.http.put<ApiResponse<CitizenResponse>>(
      `${this.stateApiUrl}/citizens/${id}/state`,
      stateUpdateDto
    );
  }

  /**
   * Updates the state of a citizen's document
   * @param id - ID of the citizen
   * @param documentType - Type of document
   * @param documentStateUpdateDto - DTO with new state and optional note
   * @returns Observable with complete API response
   */
  updateDocumentState(
    id: string,
    documentType: DocumentType,
    documentStateUpdateDto: DocumentStateUpdateDto
  ): Observable<ApiResponse<CitizenResponse>> {
    return this.http.put<ApiResponse<CitizenResponse>>(
      `${this.stateApiUrl}/citizens/${id}/documents/${documentType}/state`,
      documentStateUpdateDto
    );
  }

  /**
   * Gets citizens requiring administrative action
   * @param page - Page number (1-based)
   * @param size - Page size
   * @returns Observable with complete API response
   */
  getCitizensRequiringAction(
    page: number = 1,
    size: number = 10
  ): Observable<ApiResponse<CitizenResponse[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<CitizenResponse[]>>(
      `${this.stateApiUrl}/citizens/requiring-action`,
      { params }
    );
  }

  /**
   * Gets citizens in a specific state
   * @param state - The state to filter by
   * @param page - Page number (1-based)
   * @param size - Page size
   * @returns Observable with complete API response
   */
  getCitizensByState(
    state: CitizenState,
    page: number = 1,
    size: number = 10
  ): Observable<ApiResponse<CitizenResponse[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<CitizenResponse[]>>(
      `${this.stateApiUrl}/citizens/by-state/${state}`,
      { params }
    );
  }

  /**
   * Gets citizens with documents in a specific state
   * @param documentState - The document state to filter by
   * @param page - Page number (1-based)
   * @param size - Page size
   * @returns Observable with complete API response
   */
  getCitizensByDocumentState(
    documentState: DocumentState,
    page: number = 1,
    size: number = 10
  ): Observable<ApiResponse<CitizenResponse[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<CitizenResponse[]>>(
      `${this.stateApiUrl}/citizens/by-document-state/${documentState}`,
      { params }
    );
  }

  /**
   * Gets citizens with specific issues in their documents, using a note keyword search
   * @param noteKeyword - Keyword to search for in document state notes
   * @param page - Page number (1-based)
   * @param size - Page size
   * @returns Observable with complete API response
   */
  getCitizensByDocumentStateNote(
    noteKeyword: string,
    page: number = 1,
    size: number = 10
  ): Observable<ApiResponse<CitizenResponse[]>> {
    const params = new HttpParams()
      .set('keyword', noteKeyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<CitizenResponse[]>>(
      `${this.stateApiUrl}/citizens/by-document-note`,
      { params }
    );
  }
}
