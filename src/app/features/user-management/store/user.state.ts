import { UserResponse, UserValidationError } from '../models/user.interface';

export interface UserState {
  users: UserResponse[];
  selectedUser: UserResponse | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  errors: UserValidationError | null;
  totalUsers: number;
  lastUpdated: Date | null;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  errors: null,
  totalUsers: 0,
  lastUpdated: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },
};
