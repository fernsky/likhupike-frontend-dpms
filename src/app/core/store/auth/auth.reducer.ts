import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.types';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.initializeAuth, (state) => ({
    ...state,
    isLoading: true,
    isInitialized: false,
  })),

  on(
    AuthActions.authInitialized,
    (state, { token, user, isInitialized, isLoading }) => ({
      ...state,
      token,
      user,
      isAuthenticated: !!token && !!user,
      isInitialized,
      isLoading,
    })
  ),

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
    isAuthenticated: false,
  })),

  on(AuthActions.logout, () => ({
    ...initialAuthState,
    isInitialized: true,
    isLoading: false,
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
    // Don't set auth state on registration as we need admin approval
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { response }) => ({
    ...state,
    token: response.token,
    refreshToken: response.refreshToken,
    expiresIn: response.expiresIn,
    error: null,
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error,
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    user: null,
  })),

  on(AuthActions.terminateSession, () => ({
    ...initialAuthState,
  })),

  on(AuthActions.clearForgotPasswordState, (state) => ({
    ...state,
    forgotPassword: initialAuthState.forgotPassword,
  })),

  on(AuthActions.requestPasswordReset, (state, { email }) => ({
    ...state,
    isLoading: true,
    error: null,
    forgotPassword: {
      ...state.forgotPassword,
      email: email.email,
    },
  })),

  on(AuthActions.requestPasswordResetSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
    forgotPassword: {
      ...state.forgotPassword,
      otpSent: true,
    },
  })),

  on(AuthActions.requestPasswordResetFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    forgotPassword: {
      ...state.forgotPassword,
      otpSent: false,
    },
  })),

  on(AuthActions.verifyOtpSuccess, (state) => ({
    ...state,
    forgotPassword: {
      ...state.forgotPassword,
      otpVerified: true,
    },
  })),

  on(AuthActions.resetPassword, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.resetPasswordSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
    forgotPassword: initialAuthState.forgotPassword,
  })),

  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
