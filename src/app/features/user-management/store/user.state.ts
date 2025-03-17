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
};
