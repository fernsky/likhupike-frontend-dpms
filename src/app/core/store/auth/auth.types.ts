import { Municipality } from '../../models/municipality.interface';
import { PermissionType } from '../../models/permission.enum';

export interface AuthUser {
  id: string;
  email: string;
  permissions: Set<PermissionType>;
  isWardLevelUser: boolean;
  wardNumber?: number;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresIn: number | null;
  municipality?: Municipality;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  expiresIn: null,
};
