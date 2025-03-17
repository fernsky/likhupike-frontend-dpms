import { RoleType } from './role.enum';

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

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  roles: RoleType[];
  userId: string;
  expiresIn: number;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
