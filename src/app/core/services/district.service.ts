import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import {
  District,
  DistrictSchema,
  LocationSearchParams,
} from '../models/location.model';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import * as z from 'zod';

@Injectable({ providedIn: 'root' })
export class DistrictService extends BaseApiService {
  constructor(
    private translocoService: TranslocoService,
    protected override http: HttpClient,
    @Inject(API_CONFIG) protected override config: ApiConfig,
    protected override cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchDistricts(params: LocationSearchParams): Observable<District[]> {
    const currentLang = this.translocoService.getActiveLang();

    // Keep fields in UPPERCASE for API request
    const fields = params.fields.map((field) => field.toUpperCase());

    return this.createRequest<District[]>(
      'GET',
      '/districts/search',
      z.array(DistrictSchema),
      {
        params: {
          fields,
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
          ...(params.search && { search: params.search }),
          ...(params.provinceCode && { provinceCode: params.provinceCode }),
        },
        cache: true,
        cacheKey: `districts:${currentLang}:${JSON.stringify(params)}`,
      }
    ).pipe(
      map((districts) =>
        districts.map((district) => ({
          ...district,
          name: currentLang === 'ne' ? district.nameNepali : district.name,
        }))
      )
    );
  }
}
