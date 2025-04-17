import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ContentStatus,
  CooperativeTranslationResponse,
  CreateCooperativeTranslationDto,
  UpdateCooperativeTranslationDto,
} from '../types';
import { ApiResponse } from '@app/core/api/types/api-response.type';

/**
 * Service for managing cooperative translations
 */
@Injectable({
  providedIn: 'root',
})
export class CooperativeTranslationService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/cooperatives`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new translation for a cooperative
   * @param cooperativeId - ID of the cooperative
   * @param translationData - Data for creating a translation
   * @returns Observable with complete API response
   */
  createTranslation(
    cooperativeId: string,
    translationData: CreateCooperativeTranslationDto
  ): Observable<ApiResponse<CooperativeTranslationResponse>> {
    return this.http.post<ApiResponse<CooperativeTranslationResponse>>(
      `${this.apiUrl}/${cooperativeId}/translations`,
      translationData
    );
  }

  /**
   * Update an existing translation
   * @param cooperativeId - ID of the cooperative
   * @param translationId - ID of the translation to update
   * @param updateData - Data to update
   * @returns Observable with complete API response
   */
  updateTranslation(
    cooperativeId: string,
    translationId: string,
    updateData: UpdateCooperativeTranslationDto
  ): Observable<ApiResponse<CooperativeTranslationResponse>> {
    return this.http.put<ApiResponse<CooperativeTranslationResponse>>(
      `${this.apiUrl}/${cooperativeId}/translations/${translationId}`,
      updateData
    );
  }

  /**
   * Get translation by ID
   * @param cooperativeId - ID of the cooperative
   * @param translationId - ID of the translation to retrieve
   * @returns Observable with complete API response
   */
  getTranslationById(
    cooperativeId: string,
    translationId: string
  ): Observable<ApiResponse<CooperativeTranslationResponse>> {
    return this.http.get<ApiResponse<CooperativeTranslationResponse>>(
      `${this.apiUrl}/${cooperativeId}/translations/${translationId}`
    );
  }

  /**
   * Get translation by locale
   * @param cooperativeId - ID of the cooperative
   * @param locale - Locale code to retrieve
   * @returns Observable with complete API response
   */
  getTranslationByLocale(
    cooperativeId: string,
    locale: string
  ): Observable<ApiResponse<CooperativeTranslationResponse>> {
    return this.http.get<ApiResponse<CooperativeTranslationResponse>>(
      `${this.apiUrl}/${cooperativeId}/translations/locale/${locale}`
    );
  }

  /**
   * Get all translations for a cooperative
   * @param cooperativeId - ID of the cooperative
   * @returns Observable with complete API response
   */
  getAllTranslations(
    cooperativeId: string
  ): Observable<ApiResponse<CooperativeTranslationResponse[]>> {
    return this.http.get<ApiResponse<CooperativeTranslationResponse[]>>(
      `${this.apiUrl}/${cooperativeId}/translations`
    );
  }

  /**
   * Delete a translation
   * @param cooperativeId - ID of the cooperative
   * @param translationId - ID of the translation to delete
   * @returns Observable with complete API response
   */
  deleteTranslation(
    cooperativeId: string,
    translationId: string
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${cooperativeId}/translations/${translationId}`
    );
  }

  /**
   * Update translation status
   * @param cooperativeId - ID of the cooperative
   * @param translationId - ID of the translation to update
   * @param status - New status
   * @returns Observable with complete API response
   */
  updateTranslationStatus(
    cooperativeId: string,
    translationId: string,
    status: ContentStatus
  ): Observable<ApiResponse<CooperativeTranslationResponse>> {
    const params = new HttpParams().set('status', status);

    return this.http.patch<ApiResponse<CooperativeTranslationResponse>>(
      `${this.apiUrl}/${cooperativeId}/translations/${translationId}/status`,
      null,
      { params }
    );
  }
}
