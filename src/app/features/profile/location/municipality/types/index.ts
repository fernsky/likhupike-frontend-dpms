/**
 * Municipality create/update request DTO
 */
export interface CreateMunicipalityDto {
  name: string;
  province: string;
  district: string;
  rightmostLatitude: number;
  leftmostLatitude: number;
  bottommostLongitude: number;
  topmostLongitude: number;
  lowestAltitude?: number;
  highestAltitude?: number;
  areaInSquareKilometers: number;
}

/**
 * Municipality basic info update DTO
 */
export interface UpdateMunicipalityInfoDto {
  name: string;
  province: string;
  district: string;
}

/**
 * Municipality geo-location update DTO
 */
export interface UpdateMunicipalityGeoLocationDto {
  rightmostLatitude: number;
  leftmostLatitude: number;
  bottommostLongitude: number;
  topmostLongitude: number;
  lowestAltitude?: number;
  highestAltitude?: number;
  areaInSquareKilometers: number;
}

/**
 * Municipality response data
 */
export interface MunicipalityResponse {
  id: string;
  name: string;
  province: string;
  district: string;
  rightmostLatitude: number;
  leftmostLatitude: number;
  bottommostLongitude: number;
  topmostLongitude: number;
  lowestAltitude: number | null;
  highestAltitude: number | null;
  areaInSquareKilometers: number;
  wardsCount: number;
}

/**
 * API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
