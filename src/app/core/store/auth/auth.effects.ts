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
            return AuthActions.authInitialized({ token, user });
          }
        }
        return AuthActions.authInitialized({ token: null, user: null });
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

            const { data } = response;
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

            const successMessage = this.translocoService.translate(
              'auth.notifications.loginSuccess',
              {},
              this.translocoService.getActiveLang()
            );

            this.snackBar.open(
              successMessage,
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
            const isNotApproved = error.error?.code === 'AUTH_011';
            const messageKey = isNotApproved
              ? 'auth.notifications.userNotApproved'
              : 'auth.errors.loginFailed';

            const errorMessage = this.translocoService.translate(
              messageKey,
              {},
              this.translocoService.getActiveLang()
            );

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

            const translatedMessage = this.translocoService.translate(
              'auth.notifications.registerPending',
              {},
              this.translocoService.getActiveLang()
            );

            this.snackBar.open(
              translatedMessage,
              this.translocoService.translate('common.actions.close'),
              {
                duration: 8000,
                panelClass: ['success-snackbar', 'bottom-right'],
              }
            );

            return AuthActions.registerSuccess({ response: response.data });
          }),
          catchError((error) => {
            const errorMessage = this.translocoService.translate(
              'auth.errors.registrationFailed',
              {},
              this.translocoService.getActiveLang()
            );

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

  // Password reset request notifications
  requestPasswordResetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.requestPasswordResetSuccess),
        tap(() => {
          this.snackBar.open(
            'Password reset instructions sent to your email',
            'Close',
            {
              duration: 5000,
            }
          );
        })
      ),
    { dispatch: false }
  );

  // Password reset success notification
  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => {
          this.snackBar.open('Password successfully reset', 'Close', {
            duration: 5000,
          });
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
