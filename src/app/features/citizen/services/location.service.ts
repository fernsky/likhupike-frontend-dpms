import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import {
  Province,
  District,
  Municipality,
  Ward,
  LocationApiResponse,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Get all provinces
   * @returns Observable with array of provinces
   */
  getProvinces(): Observable<Province[]> {
    return this.http
      .get<LocationApiResponse<Province>>(`${this.apiUrl}/provinces`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get districts by province code
   * @param provinceCode - Code of the province to filter districts
   * @returns Observable with array of districts
   */
  getDistrictsByProvince(provinceCode: string): Observable<District[]> {
    return this.http
      .get<
        LocationApiResponse<District>
      >(`${this.apiUrl}/districts/by-province/${provinceCode}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get municipalities by district code
   * @param districtCode - Code of the district to filter municipalities
   * @returns Observable with array of municipalities
   */
  getMunicipalitiesByDistrict(
    districtCode: string
  ): Observable<Municipality[]> {
    return this.http
      .get<
        LocationApiResponse<Municipality>
      >(`${this.apiUrl}/municipalities/by-district/${districtCode}`)
      .pipe(map((response) => response.data));
  }

  /**
   * Get wards by municipality code
   * @param municipalityCode - Code of the municipality to filter wards
   * @returns Observable with array of wards
   */
  getWardsByMunicipality(municipalityCode: string): Observable<Ward[]> {
    return this.http
      .get<
        LocationApiResponse<Ward>
      >(`${this.apiUrl}/wards/by-municipality/${municipalityCode}`)
      .pipe(map((response) => response.data));
  }
}
