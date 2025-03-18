import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USER_FEATURE_KEY } from './user.reducer';
import { UserState } from './user.state';
import { PermissionType } from '@app/core/models/permission.enum';
import { UserResponse } from '../models/user.interface';

// Feature selector
export const selectUserState =
  createFeatureSelector<UserState>(USER_FEATURE_KEY);

// Basic selectors with null checks
export const selectUsers = createSelector(
  selectUserState,
  (state) => state?.users ?? []
);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state) => state?.selectedUser ?? null
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state?.loading ?? false
);

export const selectUserCreating = createSelector(
  selectUserState,
  (state) => state?.creating ?? false
);

export const selectUserUpdating = createSelector(
  selectUserState,
  (state) => state.updating
);

export const selectUserDeleting = createSelector(
  selectUserState,
  (state) => state.deleting
);

export const selectUserErrors = createSelector(
  selectUserState,
  (state) => state.errors
);

export const selectTotalUsers = createSelector(
  selectUserState,
  (state) => state.totalUsers
);

export const selectLastUpdated = createSelector(
  selectUserState,
  (state) => state.lastUpdated
);

// Derived selectors
export const selectUsersByPermission = (permission: PermissionType) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.permissions[permission])
  );

export const selectWardUsers = (wardNumber: number) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.wardNumber === wardNumber)
  );

export const selectActiveUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.active)
);

export const selectWardLevelUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.isWardLevelUser)
);

// Stats selectors
export const selectUserStats = createSelector(selectUsers, (users) => ({
  total: users.length,
  active: users.filter((user) => user.active).length,
  wardLevel: users.filter((user) => user.isWardLevelUser).length,
  byPermission: Object.values(PermissionType).reduce(
    (acc, permission) => ({
      ...acc,
      [permission]: users.filter((user) => user.permissions[permission]).length,
    }),
    {} as Record<PermissionType, number>
  ),
  byWard: users.reduce(
    (acc, user) => {
      if (user.wardNumber) {
        acc[user.wardNumber] = (acc[user.wardNumber] || 0) + 1;
      }
      return acc;
    },
    {} as Record<number, number>
  ),
}));

// Search and filter selectors
export const selectFilteredUsers = (filter: {
  search?: string;
  permissions?: PermissionType[];
  wardNumber?: number;
  active?: boolean;
}) =>
  createSelector(selectUsers, (users: UserResponse[]) => {
    return users.filter((user) => {
      const matchesSearch = !filter.search
        ? true
        : user.email.toLowerCase().includes(filter.search.toLowerCase());

      const matchesPermissions = !filter.permissions?.length
        ? true
        : filter.permissions.some((permission) => user.permissions[permission]);

      const matchesWard = !filter.wardNumber
        ? true
        : user.wardNumber === filter.wardNumber;

      const matchesActive =
        filter.active === undefined ? true : user.active === filter.active;

      return (
        matchesSearch && matchesPermissions && matchesWard && matchesActive
      );
    });
  });

// Loading state selectors
export const selectAnyLoading = createSelector(
  selectUserLoading,
  selectUserCreating,
  selectUserUpdating,
  selectUserDeleting,
  (loading, creating, updating, deleting) =>
    loading || creating || updating || deleting
);
