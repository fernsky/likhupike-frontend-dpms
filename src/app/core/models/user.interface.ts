import { RoleType } from './role.enum';
import { UserStatus } from './user-status.enum';
import { PermissionType } from './permission.enum';

export interface User {
  id: string;
  email: string;
  roles: RoleType[]; // Changed from Set<RoleType> to RoleType[]
  displayName?: string;
  lastLogin?: Date;
  fullName: string;
  dateOfBirth?: string;
  address?: string;
  fullNameNepali: string;
  wardNumber?: number;
  officePost?: string;
  profilePictureUrl?: string;
  status: UserStatus;
  isMunicipalityLevel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  permissions: { [key in PermissionType]?: boolean };
  isWardLevelUser: boolean;
  wardNumber?: number | null;
}

export interface UpdateUserRequest {
  email?: string;
  isWardLevelUser?: boolean;
  wardNumber?: number | null;
}

export interface UserResponse {
  id: string;
  email: string;
  isWardLevelUser: boolean;
  wardNumber?: number;
  permissions: { [key in PermissionType]: boolean };
  isApproved: boolean;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}
