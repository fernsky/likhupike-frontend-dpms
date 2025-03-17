import { RoleType } from '@app/core/models/role.enum';

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  fullNameNepali: string;
  dateOfBirth: string;
  address: string;
  officePost: string;
  wardNumber?: number;
  isMunicipalityLevel: boolean;
  profilePicture?: File;
  roles: RoleType[];
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  fullNameNepali: string;
  dateOfBirth: string;
  address: string;
  officePost: string;
  wardNumber?: number;
  isMunicipalityLevel: boolean;
  profilePictureUrl?: string;
  roles: RoleType[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface UserFilter {
  search?: string;
  wardNumber?: number;
  roles?: RoleType[];
  officePost?: string;
  active?: boolean;
  pageSize: number;
  pageIndex: number;
}

export interface UserValidationError {
  email?: string[];
  password?: string[];
  fullName?: string[];
  fullNameNepali?: string[];
  dateOfBirth?: string[];
  address?: string[];
  officePost?: string[];
  wardNumber?: string[];
  roles?: string[];
  profilePicture?: string[];
}
