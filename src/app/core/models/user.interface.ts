import { RoleType } from './role.enum';
import { UserStatus } from './user-status.enum';

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
