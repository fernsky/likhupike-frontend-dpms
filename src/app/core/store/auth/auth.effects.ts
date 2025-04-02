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
import { MatSnackBar } from '@angular/material/snack-bar';
import * as AuthActions from './auth.actions';
import { AuthUser } from './auth.types';
import { TranslocoService } from '@jsverse/transloco';
import {
  ApiResponse,
  LoginSuccessData,
  RegistrationSuccessData,
} from '../../models/auth.interface';

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

            this.snackBar.open(
              message || 'Login successful',
              this.translocoService.translate('common.actions.close'),
              {
                duration: 4000,
                panelClass: ['success-snackbar', 'bottom-right'],
              }
            );

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

            this.snackBar.open(
              response.message || 'Registration successful',
              this.translocoService.translate('common.actions.close'),
              {
                duration: 8000,
                panelClass: ['success-snackbar', 'bottom-right'],
              }
            );

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
          ).subscribe(([message, closeText]) => {
            this.snackBar.open(message, closeText, {
              duration: 3000,
            });
          });

          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  // Show error messages for auth failures
  authFailures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          AuthActions.loginFailure,
          AuthActions.refreshTokenFailure,
          AuthActions.terminateSessionFailure
        ),
        tap(({ error }) => {
          this.snackBar.open(error, 'Close', {
            duration: 5000,
          });
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
          this.snackBar.open(reason, 'Close', {
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

            this.snackBar.open(
              response.message || 'OTP has been sent to your email',
              this.translocoService.translate('common.actions.close'),
              {
                duration: 5000,
                panelClass: ['success-snackbar'],
              }
            );

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

            this.snackBar.open(
              response.message || 'Password reset successful',
              this.translocoService.translate('common.actions.close'),
              {
                duration: 5000,
                panelClass: ['success-snackbar'],
              }
            );

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
   * Centralized network error handler
   * @param error The error object from the API call
   * @param errorAction The action creator function to dispatch
   * @returns Observable with the error action
   */
  private handleNetworkError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errorActionCreator: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    let errorMessage;

    if (this.isNetworkError(error)) {
      errorMessage = this.translocoService.translate(
        'auth.errors.couldnotReachServer'
      );
    } else {
      errorMessage = error.error?.message || error.message;
    }

    // Display the error message
    this.snackBar.open(
      errorMessage,
      this.translocoService.translate('common.actions.close'),
      {
        duration: 5000,
        panelClass: ['error-snackbar', 'bottom-right'],
      }
    );

    // Return the appropriate error action
    return of(errorActionCreator({ error: errorMessage }));
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
    private snackBar: MatSnackBar,
    private translocoService: TranslocoService
  ) {}
}
