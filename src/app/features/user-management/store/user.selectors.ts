import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USER_FEATURE_KEY } from './user.reducer';
import { UserState } from './user.state';
import { RoleType } from '@app/core/models/role.enum';
import { UserResponse } from '../models/user.interface';

// Feature selector
export const selectUserState =
  createFeatureSelector<UserState>(USER_FEATURE_KEY);

// Basic selectors
export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state) => state.selectedUser
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserCreating = createSelector(
  selectUserState,
  (state) => state.creating
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
export const selectUsersByRole = (role: RoleType) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.roles.includes(role))
  );

export const selectUsersByWard = (wardNumber: number) =>
  createSelector(selectUsers, (users) =>
    users.filter((user) => user.wardNumber === wardNumber)
  );

export const selectActiveUsers = createSelector(selectUsers, (users) =>
  users.filter((user) => user.active)
);

export const selectMunicipalityLevelUsers = createSelector(
  selectUsers,
  (users) => users.filter((user) => user.isMunicipalityLevel)
);

// Stats selectors
export const selectUserStats = createSelector(selectUsers, (users) => ({
  total: users.length,
  active: users.filter((user) => user.active).length,
  municipalityLevel: users.filter((user) => user.isMunicipalityLevel).length,
  byRole: users.reduce(
    (acc, user) => {
      user.roles.forEach((role) => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    },
    {} as Record<RoleType, number>
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
  roles?: RoleType[];
  wardNumber?: number;
  active?: boolean;
}) =>
  createSelector(selectUsers, (users: UserResponse[]) => {
    return users.filter((user) => {
      const matchesSearch = !filter.search
        ? true
        : Object.values({
            fullName: user.fullName,
            fullNameNepali: user.fullNameNepali,
            email: user.email,
            address: user.address,
            officePost: user.officePost,
          }).some((value) =>
            value.toLowerCase().includes(filter.search!.toLowerCase())
          );

      const matchesRoles = !filter.roles?.length
        ? true
        : filter.roles.some((role) => user.roles.includes(role));

      const matchesWard = !filter.wardNumber
        ? true
        : user.wardNumber === filter.wardNumber;

      const matchesActive =
        filter.active === undefined ? true : user.active === filter.active;

      return matchesSearch && matchesRoles && matchesWard && matchesActive;
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
