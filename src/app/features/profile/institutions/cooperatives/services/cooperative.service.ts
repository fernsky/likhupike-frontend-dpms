import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CooperativeResponse,
  CooperativeStatus,
  CreateCooperativeDto,
  PageResponse,
  UpdateCooperativeDto,
  ApiResponse,
} from '../../cooperatives/types';

/**
 * Service for managing cooperatives
 */
@Injectable({
  providedIn: 'root',
})
export class CooperativeService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/cooperatives`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new cooperative
   * @param cooperativeData - Data for creating a cooperative
   * @returns Observable with complete API response
   */
  createCooperative(
    cooperativeData: CreateCooperativeDto
  ): Observable<ApiResponse<CooperativeResponse>> {
    return this.http.post<ApiResponse<CooperativeResponse>>(
      this.apiUrl,
      cooperativeData
    );
  }

  /**
   * Update an existing cooperative
   * @param id - ID of the cooperative to update
   * @param updateData - Data to update
   * @returns Observable with complete API response
   */
  updateCooperative(
    id: string,
    updateData: UpdateCooperativeDto
  ): Observable<ApiResponse<CooperativeResponse>> {
    return this.http.put<ApiResponse<CooperativeResponse>>(
      `${this.apiUrl}/${id}`,
      updateData
    );
  }

  /**
   * Get cooperative by ID
   * @param id - ID of the cooperative to retrieve
   * @returns Observable with complete API response
   */
  getCooperativeById(id: string): Observable<ApiResponse<CooperativeResponse>> {
    return this.http.get<ApiResponse<CooperativeResponse>>(
      `${this.apiUrl}/${id}`
    );
  }

  /**
   * Get cooperative by code
   * @param code - Code of the cooperative to retrieve
   * @returns Observable with complete API response
   */
  getCooperativeByCode(
    code: string
  ): Observable<ApiResponse<CooperativeResponse>> {
    return this.http.get<ApiResponse<CooperativeResponse>>(
      `${this.apiUrl}/code/${code}`
    );
  }

  /**
   * Delete a cooperative
   * @param id - ID of the cooperative to delete
   * @returns Observable with complete API response
   */
  deleteCooperative(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all cooperatives with pagination
   * @param page - Page number (zero-based)
   * @param size - Page size
   * @returns Observable with paginated API response
   */
  getAllCooperatives(
    page = 0,
    size = 10
  ): Observable<ApiResponse<PageResponse<CooperativeResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<PageResponse<CooperativeResponse>>>(
      this.apiUrl,
      { params }
    );
  }

  /**
   * Change cooperative status
   * @param id - ID of the cooperative to update
   * @param status - New status
   * @returns Observable with complete API response
   */
  changeCooperativeStatus(
    id: string,
    status: CooperativeStatus
  ): Observable<ApiResponse<CooperativeResponse>> {
    const params = new HttpParams().set('status', status);

    return this.http.patch<ApiResponse<CooperativeResponse>>(
      `${this.apiUrl}/${id}/status`,
      null,
      { params }
    );
  }
}
