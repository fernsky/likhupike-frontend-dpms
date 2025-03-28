import { PermissionType } from './permission.enum';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown>;
  status: number;
}

export interface LoginSuccessData {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  permissions: Set<PermissionType>;
  expiresIn: number;
  isWardLevelUser: boolean;
  wardNumber?: number;
}

export interface RegistrationSuccessData {
  email: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  isWardLevelUser: boolean;
  wardNumber?: number;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
