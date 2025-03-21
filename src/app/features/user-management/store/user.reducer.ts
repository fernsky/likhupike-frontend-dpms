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
    lastUpdated: null, // Reset lastUpdated when starting creation
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [user, ...state.users],
    creating: false,
    errors: null,
    totalUsers: state.totalUsers + 1,
    lastUpdated: new Date(),
  })),
  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    creating: false,
    errors: error,
    lastUpdated: null,
  })),

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users, total, meta }) => ({
    ...state,
    users,
    totalUsers: total,
    loading: false,
    errors: null,
    lastUpdated: new Date(),
    pagination: {
      currentPage: meta.page || 1, // Ensure we always have a valid page number
      pageSize: meta.size,
      totalElements: meta.totalElements,
      totalPages: meta.totalPages,
    },
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
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    updating: false,
    errors: error,
  })),

  // Active Status
  on(UserActions.setActiveStatus, (state) => ({
    ...state,
    updating: true,
    errors: null,
  })),
  on(UserActions.setActiveStatusSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    updating: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.setActiveStatusFailure, (state, { error }) => ({
    ...state,
    updating: false,
    errors: error,
  })),

  // Approve User
  on(UserActions.approveUser, (state) => ({
    ...state,
    updating: true,
    errors: null,
  })),
  on(UserActions.approveUserSuccess, (state, { user }) => ({
    ...state,
    // Update the user in the list while maintaining array order
    users: state.users.map((u) =>
      u.id === user.id
        ? { ...u, isApproved: true } // Just update the approval status
        : u
    ),
    updating: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.approveUserFailure, (state, { error }) => ({
    ...state,
    updating: false,
    errors: error,
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
  on(UserActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
