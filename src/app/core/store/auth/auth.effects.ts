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
          map((response) => {
            // Ensure response has required properties
            if (!response.token || !response.userId) {
              throw new Error(
                this.translocoService.translate('auth.errors.invalidResponse')
              );
            }

            const { token, userId, email, roles } = response;
            // Ensure user has required properties for AuthUser
            const authUser: AuthUser = {
              id: userId,
              email: email,
              name: '',
              roles: roles || [],
            };

            this.storageService.setToken(token);
            this.storageService.setUser(authUser);

            // Use translate$ for reactive translations
            from(
              this.translocoService
                .selectTranslate('auth.notifications.loginSuccess')
                .pipe(
                  withLatestFrom(
                    this.translocoService.selectTranslate(
                      'common.actions.close'
                    )
                  )
                )
            ).subscribe(([message, closeText]) => {
              this.snackBar.open(message, closeText, {
                duration: 3000,
              });
            });

            return AuthActions.loginSuccess({ token, user: authUser });
          }),
          catchError((error) => {
            // Use translate$ for error messages too
            from(
              this.translocoService
                .selectTranslate('auth.errors.loginFailed')
                .pipe(
                  withLatestFrom(
                    this.translocoService.selectTranslate(
                      'common.actions.close'
                    )
                  )
                )
            ).subscribe(([message, closeText]) => {
              this.snackBar.open(message, closeText, {
                duration: 5000,
              });
            });

            return of(
              AuthActions.loginFailure({
                error: this.translocoService.translate(
                  'auth.errors.loginFailed'
                ),
              })
            );
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
          map((response) => {
            if (!response.token || !response.userId) {
              throw new Error('Invalid registration response');
            }
            return AuthActions.registerSuccess({ response });
          }),
          catchError((error) => {
            const errorMessage = error.error?.message || 'Registration failed.';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
            });
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
          this.snackBar.open('Registration successful.', 'Close', {
            duration: 5000,
          });
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
