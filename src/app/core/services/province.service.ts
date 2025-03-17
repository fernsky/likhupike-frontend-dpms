import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LocationSearchParams,
  Province,
  ProvinceSchema,
} from '../models/location.model';
import { BaseLocationService } from './base-location-service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';

@Injectable({ providedIn: 'root' })
export class ProvinceService extends BaseLocationService {
  constructor(
    protected override http: HttpClient,
    @Inject(API_CONFIG) protected override config: ApiConfig,
    protected override cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchProvinces(params: LocationSearchParams): Observable<Province[]> {
    return this.searchLocation(
      '/provinces/search',
      ProvinceSchema,
      params,
      'provinces'
    );
  }

  clearProvinceCache(): void {
    this.clearCache(/^provinces:/);
  }
}
