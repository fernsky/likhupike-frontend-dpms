import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from '../api/base-api.service';
import {
  Municipality,
  MunicipalitySchema,
  LocationSearchParams,
} from '../models/location.model';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ApiConfig } from '../api/config/api.config';
import { CacheService } from '../cache/cache.service';
import * as z from 'zod';

@Injectable({ providedIn: 'root' })
export class MunicipalityService extends BaseApiService {
  constructor(
    private translocoService: TranslocoService,
    protected override http: HttpClient,
    @Inject(API_CONFIG) protected override config: ApiConfig,
    protected override cacheService: CacheService
  ) {
    super(http, config, cacheService);
  }

  searchMunicipalities(
    params: LocationSearchParams
  ): Observable<Municipality[]> {
    const currentLang = this.translocoService.getActiveLang();
    const fields = params.fields.map((field) => field.toUpperCase());

    return this.createRequest<Municipality[]>(
      'GET',
      '/municipalities/search',
      z.array(MunicipalitySchema),
      {
        params: {
          fields,
          ...(params.page && { page: params.page.toString() }),
          ...(params.limit && { limit: params.limit.toString() }),
          ...(params.search && { search: params.search }),
          ...(params.districtCode && { districtCode: params.districtCode }),
        },
        cache: true,
        cacheKey: `municipalities:${currentLang}:${JSON.stringify(params)}`,
      }
    ).pipe(
      map((municipalities) =>
        municipalities.map((municipality) => ({
          ...municipality,
          name:
            currentLang === 'ne' ? municipality.nameNepali : municipality.name,
        }))
      )
    );
  }
}
