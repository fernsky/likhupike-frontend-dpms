import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  ApiResponse,
  CooperativeResponse,
  CooperativeStatus,
  CooperativeType,
  PageResponse,
} from '../types';

/**
 * Service for searching and filtering cooperatives
 */
@Injectable({
  providedIn: 'root',
})
export class CooperativeSearchService {
  private readonly apiUrl = `${environment.apiUrl}/cooperatives/search`;

  constructor(private http: HttpClient) {}

  /**
   * Search cooperatives by name
   * @param nameQuery - Name search query
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  searchCooperativesByName(
    nameQuery: string,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeResponse>>> {
    const params = new HttpParams()
      .set('nameQuery', nameQuery)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeResponse>>>(
      `${this.apiUrl}/by-name`,
      { params }
    );
  }

  /**
   * Get cooperatives by type
   * @param type - Type of cooperative
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getCooperativesByType(
    type: CooperativeType,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeResponse>>>(
      `${this.apiUrl}/by-type/${type}`,
      { params }
    );
  }

  /**
   * Get cooperatives by status
   * @param status - Status of cooperative
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getCooperativesByStatus(
    status: CooperativeStatus,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeResponse>>>(
      `${this.apiUrl}/by-status/${status}`,
      { params }
    );
  }

  /**
   * Get cooperatives by ward
   * @param ward - Ward number
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getCooperativesByWard(
    ward: number,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeResponse>>>(
      `${this.apiUrl}/by-ward/${ward}`,
      { params }
    );
  }

  /**
   * Find cooperatives near a geographic point
   * @param longitude - Longitude coordinate
   * @param latitude - Latitude coordinate
   * @param distanceInMeters - Search radius in meters
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  findCooperativesNear(
    longitude: number,
    latitude: number,
    distanceInMeters: number,
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeResponse>>> {
    const params = new HttpParams()
      .set('longitude', longitude.toString())
      .set('latitude', latitude.toString())
      .set('distanceInMeters', distanceInMeters.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeResponse>>>(
      `${this.apiUrl}/near`,
      { params }
    );
  }

  /**
   * Get cooperative statistics by type
   * @returns Observable with map of types to counts
   */
  getCooperativeStatisticsByType(): Observable<
    ApiResponse<Record<CooperativeType, number>>
  > {
    return this.http.get<ApiResponse<Record<CooperativeType, number>>>(
      `${this.apiUrl}/statistics/by-type`
    );
  }

  /**
   * Get cooperative statistics by ward
   * @returns Observable with map of ward numbers to counts
   */
  getCooperativeStatisticsByWard(): Observable<
    ApiResponse<Record<number, number>>
  > {
    return this.http.get<ApiResponse<Record<number, number>>>(
      `${this.apiUrl}/statistics/by-ward`
    );
  }
}
