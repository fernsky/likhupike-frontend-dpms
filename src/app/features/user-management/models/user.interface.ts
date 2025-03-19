import { PermissionType } from '@app/core/models/permission.enum';

export interface CreateUserRequest {
  email: string;
  password: string;
  isWardLevelUser: boolean;
  wardNumber: number | null;
  permissions: { [key in PermissionType]: boolean };
}

export interface UpdateUserRequest {
  email?: string | null;
  isWardLevelUser?: boolean | null;
  wardNumber?: number | null;
}

export interface UserResponse {
  id: string;
  email: string;
  permissions: PermissionType[];
  isWardLevelUser: boolean;
  wardNumber: number | null;
  isApproved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilter {
  email?: string;
  isApproved?: boolean;
  isWardLevelUser?: boolean;
  wardNumberFrom?: number;
  wardNumberTo?: number;
  createdAfter?: string; // ISO string
  createdBefore?: string; // ISO string
  permissions?: PermissionType[];
  columns?: string[];
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  searchTerm?: string; // Add searchTerm to filters
}

export interface UserFilterFormValue {
  email: string | null;
  isApproved: boolean | null;
  isWardLevelUser: boolean | null;
  wardNumberFrom: number | null;
  wardNumberTo: number | null;
  createdAfter: Date | null;
  createdBefore: Date | null;
  permissions: PermissionType[];
  columns: string[];
  page: number;
  size: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  searchTerm: string | null;
}

export const ALLOWED_COLUMNS = [
  'id',
  'email',
  'isWardLevelUser',
  'wardNumber',
  'isApproved',
  'approvedBy',
  'approvedAt',
  'createdAt',
  'updatedAt',
  'permissions',
] as const;

export interface ApiError {
  code: string;
  message: string;
  details: unknown | null;
  status: number;
}

export interface ApiErrorResponse {
  success: boolean;
  error: ApiError;
}

export interface UserValidationError {
  code: string;
  message: string;
  details: unknown | null;
  status: number;
}
