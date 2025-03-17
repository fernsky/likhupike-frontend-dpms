import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  allowedOrigins: [
    'https://dpms.gov.np',
    'https://admin.dpms.gov.np',
    'https://likhupike-admin.intensivestudy.com.np',
  ],
  version: '1.0.0', // Add version with environment variable support
  apiUrl: 'https://likhupike-api.intensivestudy.com.np/api/v1',
  baseUrl: '/dpms', // Production base URL for assets
  auth: {
    loginEndpoint: '/auth/login',
    registerEndpoint: '/auth/register',
    refreshTokenEndpoint: '/auth/refresh',
    passwordResetRequestEndpoint: '/auth/password-reset/request',
    passwordResetEndpoint: '/auth/password-reset/reset',
  },
  encryptionKey: 'your-secure-prod-encryption-key-32chars', // Add this
  analytics: {
    enabled: true,
    endpoint: '/analytics',
    auditLevel: 'error',
  },
};
