import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { initialUserState } from './user.state';
import { UserValidationError } from '../models/user.interface';

export const USER_FEATURE_KEY = 'userManagement';

export const userReducer = createReducer(
  initialUserState,

  // Create User
  on(UserActions.createUser, (state) => ({
    ...state,
    creating: true,
    errors: null,
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [user, ...state.users],
    creating: false,
    errors: null,
    totalUsers: state.totalUsers + 1,
    lastUpdated: new Date(),
  })),
  on(UserActions.createUserFailure, (state, { errors }) => ({
    ...state,
    creating: false,
    errors,
  })),

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users, total }) => ({
    ...state,
    users,
    totalUsers: total,
    loading: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error as UserValidationError,
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    updating: true,
    errors: null,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    updating: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.updateUserFailure, (state, { errors }) => ({
    ...state,
    updating: false,
    errors,
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    deleting: true,
    errors: null,
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((user) => user.id !== id),
    deleting: false,
    errors: null,
    totalUsers: state.totalUsers - 1,
    lastUpdated: new Date(),
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    errors: error as UserValidationError,
  })),

  // Clear Errors
  on(UserActions.clearUserErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
