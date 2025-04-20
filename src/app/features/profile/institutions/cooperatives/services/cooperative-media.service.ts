import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ApiResponse,
  CooperativeMediaResponse,
  CooperativeMediaType,
  CreateCooperativeMediaDto,
  MediaUploadResponse,
  MediaVisibilityStatus,
  PageResponse,
  UpdateCooperativeMediaDto,
} from '../types';

/**
 * Service for managing cooperative media assets
 */
@Injectable({
  providedIn: 'root',
})
export class CooperativeMediaService {
  private readonly apiUrl = `${environment.apiUrl}/cooperatives`;

  constructor(private http: HttpClient) {}

  /**
   * Upload a media file for a cooperative
   * @param cooperativeId - ID of the cooperative
   * @param file - Media file to upload
   * @param metadata - Media metadata
   * @returns Observable with complete API response
   */
  uploadMedia(
    cooperativeId: string,
    file: File,
    metadata: CreateCooperativeMediaDto
  ): Observable<ApiResponse<MediaUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    // Append metadata properties to the form data
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return this.http.post<ApiResponse<MediaUploadResponse>>(
      `${this.apiUrl}/${cooperativeId}/media`,
      formData
    );
  }

  /**
   * Update metadata for an existing media item
   * @param cooperativeId - ID of the cooperative
   * @param mediaId - ID of the media to update
   * @param updateData - Data to update
   * @returns Observable with complete API response
   */
  updateMediaMetadata(
    cooperativeId: string,
    mediaId: string,
    updateData: UpdateCooperativeMediaDto
  ): Observable<ApiResponse<CooperativeMediaResponse>> {
    return this.http.put<ApiResponse<CooperativeMediaResponse>>(
      `${this.apiUrl}/${cooperativeId}/media/${mediaId}`,
      updateData
    );
  }

  /**
   * Get media by ID
   * @param cooperativeId - ID of the cooperative
   * @param mediaId - ID of the media to retrieve
   * @returns Observable with complete API response
   */
  getMediaById(
    cooperativeId: string,
    mediaId: string
  ): Observable<ApiResponse<CooperativeMediaResponse>> {
    return this.http.get<ApiResponse<CooperativeMediaResponse>>(
      `${this.apiUrl}/${cooperativeId}/media/${mediaId}`
    );
  }

  /**
   * Get all media for a cooperative with pagination
   * @param cooperativeId - ID of the cooperative
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getAllMediaForCooperative(
    cooperativeId: string,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeMediaResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeMediaResponse>>>(
      `${this.apiUrl}/${cooperativeId}/media`,
      { params }
    );
  }

  /**
   * Get media by type
   * @param cooperativeId - ID of the cooperative
   * @param type - Type of media to filter by
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getMediaByType(
    cooperativeId: string,
    type: CooperativeMediaType,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeMediaResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeMediaResponse>>>(
      `${this.apiUrl}/${cooperativeId}/media/by-type/${type}`,
      { params }
    );
  }

  /**
   * Delete a media item
   * @param cooperativeId - ID of the cooperative
   * @param mediaId - ID of the media to delete
   * @returns Observable with complete API response
   */
  deleteMedia(
    cooperativeId: string,
    mediaId: string
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${cooperativeId}/media/${mediaId}`
    );
  }

  /**
   * Set a media item as primary for its type
   * @param cooperativeId - ID of the cooperative
   * @param mediaId - ID of the media to set as primary
   * @returns Observable with complete API response
   */
  setMediaAsPrimary(
    cooperativeId: string,
    mediaId: string
  ): Observable<ApiResponse<CooperativeMediaResponse>> {
    return this.http.post<ApiResponse<CooperativeMediaResponse>>(
      `${this.apiUrl}/${cooperativeId}/media/${mediaId}/set-primary`,
      null
    );
  }

  /**
   * Update media visibility status
   * @param cooperativeId - ID of the cooperative
   * @param mediaId - ID of the media to update
   * @param status - New visibility status
   * @returns Observable with complete API response
   */
  updateMediaVisibility(
    cooperativeId: string,
    mediaId: string,
    status: MediaVisibilityStatus
  ): Observable<ApiResponse<CooperativeMediaResponse>> {
    const params = new HttpParams().set('status', status);

    return this.http.patch<ApiResponse<CooperativeMediaResponse>>(
      `${this.apiUrl}/${cooperativeId}/media/${mediaId}/visibility`,
      null,
      { params }
    );
  }
}
