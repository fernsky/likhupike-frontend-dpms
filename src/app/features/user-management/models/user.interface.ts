import { PermissionType } from '@app/core/models/permission.enum';

export interface CreateUserRequest {
  email: string;
  password: string;
  permissions: { [key in PermissionType]: boolean };
  isWardLevelUser: boolean;
  wardNumber?: number | null;
}

export interface UpdateUserRequest {
  email?: string | null;
  isWardLevelUser?: boolean | null;
  wardNumber?: number | null;
}

export interface UserResponse {
  id: string;
  email: string;
  permissions: { [key in PermissionType]: boolean };
  isWardLevelUser: boolean;
  wardNumber?: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
  active: boolean;
}

export interface UserFilter {
  search?: string;
  wardNumber?: number;
  permissions?: PermissionType[];
  isWardLevelUser?: boolean;
  pageSize: number;
  pageIndex: number;
}

export interface UserValidationError {
  email?: string[];
  password?: string[];
  permissions?: string[];
  isWardLevelUser?: string[];
  wardNumber?: string[];
}
