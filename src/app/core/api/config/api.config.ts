import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

export interface ApiConfig {
  baseUrl: string;
  defaultLanguage: string;
  cacheTTL: number;
  retryAttempts: number;
  timeout: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: environment.apiUrl,
  defaultLanguage: 'en',
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  timeout: 30000, // 30 seconds
};

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
