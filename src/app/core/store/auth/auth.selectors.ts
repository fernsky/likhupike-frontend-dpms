import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.types';
import { RoleType } from '../../models/role.enum';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

// Derived selectors
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectUserRoles = createSelector(
  selectUser,
  // (user) => user?.roles || []
  () => [RoleType.MUNICIPALITY_ADMIN]
);

// Role-based selectors
export const selectUserPermissions = createSelector(
  selectUserRoles,
  (roles) => ({
    isSuperAdmin: roles.includes(RoleType.SUPER_ADMIN),
    isMunicipalityAdmin: roles.includes(RoleType.MUNICIPALITY_ADMIN),
    isWardAdmin: roles.includes(RoleType.WARD_ADMIN),
    isEditor: roles.includes(RoleType.EDITOR),
    isViewer: roles.includes(RoleType.VIEWER),
  })
);

// Municipality selectors
export const selectMunicipality = createSelector(
  selectAuthState,
  (state: AuthState) => state.municipality
);

export const selectMunicipalityDetails = createSelector(
  selectMunicipality,
  (municipality) => ({
    code: municipality?.code,
    name: municipality?.name,
    nameNepali: municipality?.nameNepali,
    type: municipality?.type,
    totalWards: municipality?.totalWards || 0,
  })
);

export const selectDistrict = createSelector(
  selectMunicipality,
  (municipality) => municipality?.district
);

export const selectMunicipalityLocation = createSelector(
  selectMunicipality,
  (municipality) => ({
    latitude: municipality?.latitude,
    longitude: municipality?.longitude,
    area: municipality?.area,
  })
);
