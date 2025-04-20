import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ApiResponse,
  CooperativeType,
  CooperativeTypeTranslationDto,
  CooperativeTypeTranslationResponse,
  PageResponse,
} from '../types';

/**
 * Service for managing cooperative type translations
 */
@Injectable({
  providedIn: 'root',
})
export class CooperativeTypeTranslationService {
  private readonly apiUrl = `${environment.apiUrl}/cooperative-types`;

  constructor(private http: HttpClient) {}

  /**
   * Create or update a type translation
   * @param translationData - Data for creating or updating a type translation
   * @returns Observable with complete API response
   */
  createOrUpdateTypeTranslation(
    translationData: CooperativeTypeTranslationDto
  ): Observable<ApiResponse<CooperativeTypeTranslationResponse>> {
    return this.http.post<ApiResponse<CooperativeTypeTranslationResponse>>(
      `${this.apiUrl}/translations`,
      translationData
    );
  }

  /**
   * Get type translation by ID
   * @param translationId - ID of the translation to retrieve
   * @returns Observable with complete API response
   */
  getTypeTranslationById(
    translationId: string
  ): Observable<ApiResponse<CooperativeTypeTranslationResponse>> {
    return this.http.get<ApiResponse<CooperativeTypeTranslationResponse>>(
      `${this.apiUrl}/translations/${translationId}`
    );
  }

  /**
   * Get type translation by type and locale
   * @param type - Type of cooperative
   * @param locale - Locale code
   * @returns Observable with complete API response
   */
  getTypeTranslationByTypeAndLocale(
    type: CooperativeType,
    locale: string
  ): Observable<ApiResponse<CooperativeTypeTranslationResponse>> {
    return this.http.get<ApiResponse<CooperativeTypeTranslationResponse>>(
      `${this.apiUrl}/translations/type/${type}/locale/${locale}`
    );
  }

  /**
   * Get all translations for a specific type
   * @param type - Type of cooperative
   * @returns Observable with complete API response
   */
  getAllTranslationsForType(
    type: CooperativeType
  ): Observable<ApiResponse<CooperativeTypeTranslationResponse[]>> {
    return this.http.get<ApiResponse<CooperativeTypeTranslationResponse[]>>(
      `${this.apiUrl}/translations/type/${type}`
    );
  }

  /**
   * Get all translations for a specific locale with pagination
   * @param locale - Locale code
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getTypeTranslationsByLocale(
    locale: string,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeTypeTranslationResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<
      ApiResponse<PageResponse<CooperativeTypeTranslationResponse>>
    >(`${this.apiUrl}/translations/locale/${locale}`, { params });
  }

  /**
   * Delete a type translation
   * @param type - Type of cooperative
   * @param locale - Locale code
   * @returns Observable with complete API response
   */
  deleteTypeTranslation(
    type: CooperativeType,
    locale: string
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/translations/type/${type}/locale/${locale}`
    );
  }

  /**
   * Get all available cooperative types with their translations for a specific locale
   * @param locale - Locale code
   * @returns Observable with complete API response
   */
  getAllTypeTranslationsForLocale(
    locale: string
  ): Observable<
    ApiResponse<Record<CooperativeType, CooperativeTypeTranslationResponse>>
  > {
    return this.http.get<
      ApiResponse<Record<CooperativeType, CooperativeTypeTranslationResponse>>
    >(`${this.apiUrl}/translations/all-types/locale/${locale}`);
  }
}
