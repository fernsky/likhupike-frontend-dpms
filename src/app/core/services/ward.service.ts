import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import {
  Ward,
  WardSchema,
  LocationSearchParams,
} from '../models/location.model';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import * as z from 'zod';

@Injectable({ providedIn: 'root' })
export class WardService extends BaseApiService {
  constructor(
    protected override http: HttpClient,
    @Inject(API_CONFIG) protected override config: ApiConfig,
    protected override cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchWards(params: LocationSearchParams): Observable<Ward[]> {
    // Keep fields in UPPERCASE for API request
    const fields = params.fields.map((field) => field.toUpperCase());

    return this.createRequest<Ward[]>(
      'GET',
      '/wards/search',
      z.array(WardSchema),
      {
        params: {
          fields,
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
          ...(params.municipalityCode && {
            municipalityCode: params.municipalityCode,
          }),
        },
        cache: true,
        cacheKey: `wards:${JSON.stringify(params)}`,
      }
    );
  }
}
