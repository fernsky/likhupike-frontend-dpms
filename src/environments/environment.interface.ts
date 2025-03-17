export interface Environment {
  production: boolean;
  version: string; // Add version field
  apiUrl: string;
  allowedOrigins: string[];
  baseUrl: string;
  encryptionKey: string;
  auth: {
    loginEndpoint: string;
    registerEndpoint: string;
    refreshTokenEndpoint: string;
    passwordResetRequestEndpoint: string;
    passwordResetEndpoint: string;
  };
  analytics: {
    enabled: boolean;
    endpoint: string;
    auditLevel: string;
  };
}
