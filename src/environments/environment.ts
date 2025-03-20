import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  allowedOrigins: [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://likhupike-admin.intensivestudy.com.np',
    'https://localhost:8080',
  ],
  version: '1.0.0-dev', // Add version
  // apiUrl: 'https://likhupike-dpms-api.intensivestudy.com.np/api/v1',
  apiUrl: 'http://localhost:8080/api/v1',
  baseUrl: '', // Empty string for development as assets are served from root
  auth: {
    loginEndpoint: '/auth/login',
    registerEndpoint: '/auth/register',
    refreshTokenEndpoint: '/auth/refresh',
    passwordResetRequestEndpoint: '/auth/password-reset/request',
    passwordResetEndpoint: '/auth/password-reset/reset',
  },
  analytics: {
    enabled: true,
    endpoint: '/analytics',
    auditLevel: 'error',
  },
  encryptionKey: 'your-secure-development-encryption-key-32chars', // Add this
};
