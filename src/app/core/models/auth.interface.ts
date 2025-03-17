import { RoleType } from './role.enum';
import { UserType } from './user-type.enum';
import { OfficeSection, ElectedPosition } from './office.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  fullNameNepali: string;
  dateOfBirth?: string;
  address: string;
  userType: UserType;
  provinceCode?: string;
  districtCode?: string;
  municipalityCode?: string;
  wardNumber?: number;
  officeSection?: OfficeSection;
  electedPosition?: ElectedPosition;
  officePost?: string;
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
