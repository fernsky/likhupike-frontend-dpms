import {
  UserFilter,
  UserResponse,
  UserValidationError,
} from '../models/user.interface';

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
  filter: UserFilter; // Add this to store current filter state
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
  createSuccess: boolean;
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
  filter: {
    page: 1,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },
  createSuccess: false,
};
