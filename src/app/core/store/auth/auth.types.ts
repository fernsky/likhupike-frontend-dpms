import { RoleType } from '@app/core/models/role.enum';
import { Municipality } from '../../models/municipality.interface';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: RoleType[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  municipality?: Municipality;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
