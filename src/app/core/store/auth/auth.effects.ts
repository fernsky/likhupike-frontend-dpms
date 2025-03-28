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
import { of, from } from 'rxjs';
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
              message || 'Login successful', // Use API message
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
          catchError((error) => {
            // Use API error message directly
            const errorMessage = error.error?.message || error.message;
            this.snackBar.open(
              errorMessage,
              this.translocoService.translate('common.actions.close'),
              {
                duration: 5000,
                panelClass: ['error-snackbar', 'bottom-right'],
              }
            );

            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
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
              response.message || 'Registration successful', // Use API message
              this.translocoService.translate('common.actions.close'),
              {
                duration: 8000,
                panelClass: ['success-snackbar', 'bottom-right'],
              }
            );

            return AuthActions.registerSuccess({ response: response.data });
          }),
          catchError((error) => {
            const errorMessage = error.error?.message || error.message;
            this.snackBar.open(
              errorMessage,
              this.translocoService.translate('common.actions.close'),
              {
                duration: 5000,
                panelClass: ['error-snackbar', 'bottom-right'],
              }
            );
            return of(AuthActions.registerFailure({ error: errorMessage }));
          })
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
          catchError((error) => {
            const errorMessage = error.error?.message || error.message;
            this.snackBar.open(
              errorMessage,
              this.translocoService.translate('common.actions.close'),
              {
                duration: 5000,
                panelClass: ['error-snackbar'],
              }
            );
            return of(
              AuthActions.requestPasswordResetFailure({ error: errorMessage })
            );
          })
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
          catchError((error) => {
            const errorMessage = error.error?.message || error.message;
            this.snackBar.open(
              errorMessage,
              this.translocoService.translate('common.actions.close'),
              {
                duration: 5000,
                panelClass: ['error-snackbar'],
              }
            );
            return of(
              AuthActions.resetPasswordFailure({ error: errorMessage })
            );
          })
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
