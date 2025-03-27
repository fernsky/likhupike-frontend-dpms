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
    users: [], // Clear users on error
    totalUsers: 0,
  })),

  // Load Single User
  on(UserActions.loadUser, (state) => ({
    ...state,
    loading: true,
    selectedUser: null, // Clear selected user
    errors: null,
  })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.loadUserFailure, (state, { error }) => ({
    ...state,
    selectedUser: null,
    loading: false,
    errors: error,
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
    selectedUser: user,
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

  // Reset Password
  on(UserActions.resetUserPassword, (state) => ({
    ...state,
    updating: true,
    errors: null,
  })),
  on(UserActions.resetUserPasswordSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    updating: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.resetUserPasswordFailure, (state, { error }) => ({
    ...state,
    updating: false,
    errors: error,
  })),

  // Update Permissions
  on(UserActions.updatePermissions, (state) => ({
    ...state,
    updating: true,
    errors: null,
  })),
  on(UserActions.updatePermissionsSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) =>
      u.id === user.id
        ? {
            ...u,
            permissions: user.permissions, // Keep the full Permission objects
          }
        : u
    ),
    selectedUser: {
      ...state.selectedUser!,
      permissions: user.permissions, // Keep full permission objects for selected user
    },
    updating: false,
    errors: null,
    lastUpdated: new Date(),
  })),
  on(UserActions.updatePermissionsFailure, (state, { error }) => ({
    ...state,
    updating: false,
    errors: error,
  })),

  // Add new filter actions
  on(UserActions.filterChange, (state, { filter }) => ({
    ...state,
    filter: {
      ...state.filter,
      ...filter,
      page: 1, // Reset page when filter changes
    },
  })),

  on(UserActions.setPage, (state, { pageIndex, pageSize }) => ({
    ...state,
    filter: {
      ...state.filter,
      page: pageIndex,
      size: pageSize,
    },
  })),

  on(UserActions.resetFilters, (state) => ({
    ...state,
    filter: {
      page: 1,
      size: 10,
      sortBy: 'createdAt',
      sortDirection: 'DESC' as 'ASC' | 'DESC',
    },
  })),

  // Clear Errors
  on(UserActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
