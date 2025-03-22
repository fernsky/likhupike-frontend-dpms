import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService,
    private router: Router,
    private store: Store // Add Store injection
  ) {}

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      exhaustMap(({ request }) =>
        this.userService.createUser(request).pipe(
          map(({ user, message }) => {
            this.showSuccess(message); // Use API's success message
            return UserActions.createUserSuccess({ user });
          }),
          catchError((error) => {
            console.error('Create user error:', error);
            this.showError(error.message);
            return of(UserActions.createUserFailure({ error }));
          })
        )
      )
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      exhaustMap(({ filter }) =>
        this.userService.getUsers(filter).pipe(
          map(({ users, total, meta }) => {
            // Calculate pagination values with all required properties
            const validMeta = {
              page: meta.page ?? filter.page ?? 0,
              size: meta.size ?? filter.size ?? 10,
              totalElements: total,
              totalPages: Math.ceil(total / (meta.size ?? filter.size ?? 10)),
              isFirst: (meta.page ?? filter.page ?? 0) === 0,
              isLast:
                (meta.page ?? filter.page ?? 0) >=
                Math.ceil(total / (meta.size ?? filter.size ?? 10)) - 1,
            };
            return UserActions.loadUsersSuccess({
              users,
              total,
              meta: validMeta,
            });
          }),
          catchError((error) => {
            this.showError(error.message);
            return of(UserActions.loadUsersFailure({ error }));
          })
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      exhaustMap(({ id }) =>
        this.userService.getUserById(id).pipe(
          map((user) => {
            console.log('User loaded successfully:', user);
            return UserActions.loadUserSuccess({ user });
          }),
          catchError((error) => {
            console.error('Error loading user:', error);
            this.showError(error.message || 'user.messages.loadError');
            return of(UserActions.loadUserFailure({ error }));
          })
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      exhaustMap(({ id, request }) =>
        this.userService.updateUser(id, request).pipe(
          map(({ user, message }) => {
            this.showSuccess(message); // Use API's message
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            this.showError(error.message); // Use API's error message
            return of(UserActions.updateUserFailure({ error }));
          })
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      exhaustMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(({ message }) => {
            this.showSuccess(message); // Use API success message
            this.router.navigate(['/dashboard/users/list']);
            return UserActions.deleteUserSuccess({ id });
          }),
          catchError((error) => {
            this.showError(error.message); // Use API error message
            return of(UserActions.deleteUserFailure({ error }));
          })
        )
      )
    )
  );

  approveUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.approveUser),
      exhaustMap(({ id }) =>
        this.userService.approveUser(id).pipe(
          map(({ user, message }) => {
            this.showSuccess(message); // Use API success message
            return UserActions.approveUserSuccess({ user, message });
          }),
          catchError((error) => {
            this.showError(error.message); // Use API error message
            return of(UserActions.approveUserFailure({ error }));
          })
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.resetUserPassword),
      exhaustMap(({ id, request }) =>
        this.userService.resetPassword(id, request).pipe(
          map((user) => {
            this.showSuccess('user.messages.passwordResetSuccess');
            return UserActions.resetUserPasswordSuccess({ user });
          }),
          catchError((error) => {
            this.showError(error.message);
            return of(UserActions.resetUserPasswordFailure({ error }));
          })
        )
      )
    )
  );

  updatePermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updatePermissions),
      exhaustMap(({ id, request }) =>
        this.userService.updatePermissions(id, request).pipe(
          map(({ user, message }) => {
            this.showSuccess(message);
            return UserActions.updatePermissionsSuccess({ user });
          }),
          catchError((error) => {
            this.showError(error.message);
            return of(UserActions.updatePermissionsFailure({ error }));
          })
        )
      )
    )
  );

  // Helper method to show success messages
  private showSuccess(message: string): void {
    this.snackBar.open(
      message, // Use API message directly
      this.transloco.translate('common.actions.close'),
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  // Helper method to show error messages
  private showError(message: string): void {
    this.snackBar.open(
      message, // Use the error message directly from the API
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
