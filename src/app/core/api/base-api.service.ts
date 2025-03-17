import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout, retry, map } from 'rxjs/operators';
import { API_CONFIG, ApiConfig } from './config/api.config';
import { CacheService } from '../cache/cache.service';
import { z } from 'zod';
import {
  ApiResponse,
  createApiResponseSchema,
} from './types/api-response.type';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  constructor(
    protected http: HttpClient,
    @Inject(API_CONFIG) protected config: ApiConfig,
    protected cacheService: CacheService
  ) {}

  protected createRequest<T>(
    method: string,
    endpoint: string,
    schema: z.ZodType<T>,
    options: {
      params?: { [key: string]: string | string[] };
      body?: any;
      cache?: boolean;
      cacheKey?: string;
    } = {}
  ): Observable<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const cacheKey =
      options.cacheKey || `${method}:${url}:${JSON.stringify(options.params)}`;

    if (options.cache) {
      const cached = this.cacheService.get<T>(cacheKey);
      if (cached) return cached;
    }

    let params = new HttpParams();
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          params = params.set(key, value.join(','));
        } else {
          params = params.set(key, value);
        }
      });
    }

    const responseSchema = createApiResponseSchema(schema);

    const request$ = this.http
      .request<ApiResponse<T>>(method, url, { params, body: options.body })
      .pipe(
        timeout(this.config.timeout),
        retry(this.config.retryAttempts),
        map((response) => {
          const validated = responseSchema.parse(response);
          if (!validated.success) {
            throw new Error(validated.message || 'Request failed');
          }
          return validated.data as T;
        }),
        catchError((error) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );

    return options.cache ? this.cacheService.set(cacheKey, request$) : request$;
  }
}
