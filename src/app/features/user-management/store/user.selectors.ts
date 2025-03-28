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

export const selectCreateSuccess = createSelector(
  selectUserState,
  (state) => state.createSuccess
);

// Derived selectors
export const selectUsersByPermission = (permission: PermissionType) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.permissions.includes(permission))
  );

export const selectWardUsers = (wardNumber: number) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.wardNumber === wardNumber)
  );

export const selectApprovedUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.isApproved)
);

export const selectWardLevelUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.isWardLevelUser)
);

// Stats selectors
export const selectUserStats = createSelector(selectUsers, (users) => ({
  total: users.length,
  approved: users.filter((user) => user.isApproved).length,
  wardLevel: users.filter((user) => user.isWardLevelUser).length,
  byPermission: Object.values(PermissionType).reduce(
    (acc, permission) => ({
      ...acc,
      [permission]: users.filter((user) =>
        user.permissions.includes(permission)
      ).length,
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
  isApproved?: boolean;
}) =>
  createSelector(selectUsers, (users: UserResponse[]) => {
    return users.filter((user) => {
      const matchesSearch = !filter.search
        ? true
        : user.email.toLowerCase().includes(filter.search.toLowerCase());

      const matchesPermissions = !filter.permissions?.length
        ? true
        : filter.permissions.some((permission) =>
            user.permissions.includes(permission)
          );

      const matchesWard = !filter.wardNumber
        ? true
        : user.wardNumber === filter.wardNumber;

      const matchesApproved =
        filter.isApproved === undefined
          ? true
          : user.isApproved === filter.isApproved;

      return (
        matchesSearch && matchesPermissions && matchesWard && matchesApproved
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

export const selectPagination = createSelector(
  selectUserState,
  (state) => state.pagination
);

export const selectCurrentPage = createSelector(
  selectPagination,
  (pagination) => pagination.currentPage
);

export const selectPageSize = createSelector(
  selectPagination,
  (pagination) => pagination.pageSize
);

export const selectCurrentFilter = createSelector(
  selectUserState,
  (state) => state.filter
);

export const selectSortState = createSelector(
  selectCurrentFilter,
  (filter) => ({
    sortBy: filter.sortBy || 'createdAt',
    direction: filter.sortDirection || 'DESC',
  })
);

export const selectFilterWithoutPagination = createSelector(
  selectCurrentFilter,
  (filter) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, size, ...filterWithoutPagination } = filter;
    return filterWithoutPagination;
  }
);
