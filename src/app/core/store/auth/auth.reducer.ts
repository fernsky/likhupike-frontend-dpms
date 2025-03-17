import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.types';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.initializeAuth, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.authInitialized, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isAuthenticated: !!token && !!user,
    isLoading: false,
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(AuthActions.logout, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    user: {
      id: response.userId,
      email: response.email,
      name: '',
      roles: response.roles || [],
    },
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
