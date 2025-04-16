import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CreateMunicipalityDto,
  MunicipalityResponse,
  UpdateMunicipalityGeoLocationDto,
  UpdateMunicipalityInfoDto
} from '../../municipality/types';
import { ApiResponse } from '@app/core/api/types/api-response.type';

/**
 * Service for managing municipality profile data
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileMunicipalityService {
  private readonly apiUrl = `${environment.apiUrl}/profile/location/municipality`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new municipality profile or return existing one
   * @param municipalityData - Data for creating a municipality profile
   * @returns Observable with complete API response
   */
  createMunicipality(
    municipalityData: CreateMunicipalityDto
  ): Observable<ApiResponse<MunicipalityResponse>> {
    return this.http.post<ApiResponse<MunicipalityResponse>>(
      this.apiUrl,
      municipalityData
    );
  }

  /**
   * Get current municipality profile information
   * @returns Observable with complete API response
   */
  getMunicipalityInfo(): Observable<ApiResponse<MunicipalityResponse>> {
    return this.http.get<ApiResponse<MunicipalityResponse>>(this.apiUrl);
  }

  /**
   * Update municipality basic information (name, province, district)
   * @param municipalityInfoData - Basic info data to update
   * @returns Observable with complete API response
   */
  updateMunicipalityInfo(
    municipalityInfoData: UpdateMunicipalityInfoDto
  ): Observable<ApiResponse<MunicipalityResponse>> {
    return this.http.put<ApiResponse<MunicipalityResponse>>(
      `${this.apiUrl}/info`,
      municipalityInfoData
    );
  }

  /**
   * Update municipality geographical information
   * @param geoLocationData - Geographical data to update
   * @returns Observable with complete API response
   */
  updateMunicipalityGeoLocation(
    geoLocationData: UpdateMunicipalityGeoLocationDto
  ): Observable<ApiResponse<MunicipalityResponse>> {
    return this.http.put<ApiResponse<MunicipalityResponse>>(
      `${this.apiUrl}/geo-location`,
      geoLocationData
    );
  }
}
