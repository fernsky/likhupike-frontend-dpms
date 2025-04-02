import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { GlobalNotificationService } from '../../services/global-notification.service';
import * as AuthActions from './auth.actions';
import { AuthUser } from './auth.types';
import { TranslocoService } from '@jsverse/transloco';
import {
  ApiResponse,
  LoginSuccessData,
  RegistrationSuccessData,
} from '../../models/auth.interface';

interface ErrorWithNetworkFlag {
  error: string;
  isNetworkError?: boolean;
}

@Injectable()
export class AuthEffects {
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        if (this.storageService.hasStoredAuth()) {
          const token = this.storageService.getToken();
          const user = this.storageService.getUser();

          if (token && user) {
            return AuthActions.authInitialized({
              token,
              user,
              isInitialized: true,
              isLoading: false,
            });
          }
        }
        return AuthActions.authInitialized({
          token: null,
          user: null,
          isInitialized: true,
          isLoading: false,
        });
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response: ApiResponse<LoginSuccessData>) => {
            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Login failed');
            }

            const { data, message } = response;
            const authUser: AuthUser = {
              id: data.userId,
              email: data.email,
              permissions: data.permissions,
              isWardLevelUser: data.isWardLevelUser,
              wardNumber: data.wardNumber,
            };

            this.storageService.setToken(data.token);
            this.storageService.setRefreshToken(data.refreshToken);
            this.storageService.setUser(authUser);

            this.globalNotificationService.showNotification({
              type: 'success',
              title: 'Success',
              message: message || 'Login successful',
              duration: 4000,
            });

            return AuthActions.loginSuccess({
              token: data.token,
              user: authUser,
            });
          }),
          catchError((error) =>
            this.handleNetworkError(error, AuthActions.loginFailure)
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response: ApiResponse<RegistrationSuccessData>) => {
            if (!response.success || !response.data) {
              throw new Error(response.error?.message || 'Registration failed');
            }

            this.globalNotificationService.showNotification({
              type: 'success',
              title: 'Success',
              message: response.message || 'Registration successful',
              duration: 8000,
            });

            return AuthActions.registerSuccess({ response: response.data });
          }),
          catchError((error) =>
            this.handleNetworkError(error, AuthActions.registerFailure)
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          // After registration, always redirect to login since we need admin approval
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.storageService.clearAuth();

          // Use translate$ for reactive translations
          from(
            this.translocoService
              .selectTranslate('auth.notifications.logoutSuccess')
              .pipe(
                withLatestFrom(
                  this.translocoService.selectTranslate('common.actions.close')
                )
              )
          ).subscribe(([message]) => {
            this.globalNotificationService.showNotification({
              type: 'info',
              title: 'Logout',
              message: message,
              duration: 3000,
            });
          });

          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // Show error messages for auth failures, but only if they're not network errors
  authFailures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.loginFailure,
          AuthActions.refreshTokenFailure,
          AuthActions.terminateSessionFailure,
          AuthActions.registerFailure,
          AuthActions.requestPasswordResetFailure,
          AuthActions.resetPasswordFailure
        ),
        tap((action) => {
          // Only show notification if it's not a network error
          // Network errors are already handled in handleNetworkError
          const errorAction = action as ErrorWithNetworkFlag;
          if (!errorAction.isNetworkError && errorAction.error) {
            this.globalNotificationService.showNotification({
              type: 'error',
              title: 'Error',
              message: errorAction.error,
              duration: 5000,
            });
          }
        })
      ),
    { dispatch: false }
  );

  // Handle session termination
  terminateSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.terminateSession),
        tap(({ reason }) => {
          this.storageService.clearAuth();
          this.globalNotificationService.showNotification({
            type: 'warning',
            title: 'Session Terminated',
            message: reason,
            duration: 5000,
          });
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestPasswordReset),
      switchMap(({ email }) =>
        this.authService.requestPasswordReset(email).pipe(
          map((response) => {
            if (!response.success) {
              throw new Error(response.error?.message || 'Request failed');
            }

            this.globalNotificationService.showNotification({
              type: 'success',
              title: 'Password Reset',
              message: response.message || 'OTP has been sent to your email',
              duration: 5000,
            });

            return AuthActions.requestPasswordResetSuccess();
          }),
          catchError((error) =>
            this.handleNetworkError(
              error,
              AuthActions.requestPasswordResetFailure
            )
          )
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      switchMap(({ resetData }) =>
        this.authService.resetPassword(resetData).pipe(
          map((response) => {
            if (!response.success) {
              throw new Error(response.error?.message || 'Reset failed');
            }

            this.globalNotificationService.showNotification({
              type: 'success',
              title: 'Success',
              message: response.message || 'Password reset successful',
              duration: 5000,
            });

            return AuthActions.resetPasswordSuccess();
          }),
          catchError((error) =>
            this.handleNetworkError(error, AuthActions.resetPasswordFailure)
          )
        )
      )
    )
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Refactored network error handler:
   * - Processes error message but doesn't show notifications directly
   * - Adds isNetworkError flag to the action payload
   * - For network errors, shows notification here and adds flag
   * - For regular errors, just passes error message to action
   */
  private handleNetworkError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorActionCreator: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    let errorMessage;
    const isNetworkError = this.isNetworkError(error);

    if (isNetworkError) {
      errorMessage = this.translocoService.translate(
        'auth.errors.couldnotReachServer'
      );

      // Only for network errors, show notification directly
      // This prevents duplicate notifications for other errors
      this.globalNotificationService.showNotification({
        type: 'error',
        title: 'Connection Error',
        message: errorMessage,
        duration: 5000,
      });
    } else {
      errorMessage = error.error?.message || error.message;
    }

    // Return the appropriate error action with network error flag
    return of(
      errorActionCreator({
        error: errorMessage,
        isNetworkError, // Add flag to determine if it's a network error
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isNetworkError(error: any): boolean {
    return (
      error.error?.status === 500 ||
      error.status === 0 ||
      (error.name === 'HttpErrorResponse' && !error.status) ||
      (error.message &&
        (error.message.includes('ECONNREFUSED') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('Network Error')))
    );
  }

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private store: Store,
    private globalNotificationService: GlobalNotificationService,
    private translocoService: TranslocoService
  ) {}
}
