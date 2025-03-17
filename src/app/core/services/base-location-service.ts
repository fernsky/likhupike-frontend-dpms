import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import { LocationSearchParams } from '../models/location.model';
import { z } from 'zod';

@Injectable()
export abstract class BaseLocationService extends BaseApiService {
  constructor(
    protected override http: HttpClient,
    @Inject(API_CONFIG) protected override config: ApiConfig,
    protected override cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  protected searchLocation<T>(
    endpoint: string,
    schema: z.ZodType<T>,
    params: LocationSearchParams,
    cacheKeyPrefix: string
  ): Observable<T[]> {
    const fields = params.fields.map((field) => field.toUpperCase());

    return this.createRequest<T[]>('GET', endpoint, z.array(schema), {
      params: {
        fields,
        ...(params.page && { page: params.page.toString() }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.search && { search: params.search }),
        ...(params.provinceCode && { provinceCode: params.provinceCode }),
        ...(params.districtCode && { districtCode: params.districtCode }),
        ...(params.municipalityCode && {
          municipalityCode: params.municipalityCode,
        }),
      },
      cache: true,
      cacheKey: `${cacheKeyPrefix}:${JSON.stringify(params)}`,
    });
  }

  clearCache(pattern: RegExp): void {
    this.cacheService.invalidate(pattern);
  }
}
