import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
    private router: Router
  ) {}

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      exhaustMap(({ request }) =>
        this.userService.createUser(request).pipe(
          map((user) => {
            this.showSuccess('user.messages.createSuccess');
            this.router.navigate(['/dashboard/users/list']);
            return UserActions.createUserSuccess({ user });
          }),
          catchError((error) => {
            console.error('Create user error:', error);
            this.showError(error.message || 'Failed to create user');
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
          map(({ users, total }) =>
            UserActions.loadUsersSuccess({ users, total })
          ),
          catchError((error) => {
            this.showError(error.message || 'Failed to load users');
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
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) => {
            this.showError('user.messages.loadError');
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
          map((user) => {
            this.showSuccess('user.messages.updateSuccess');
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            this.showError('user.messages.updateError');
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
          map(() => {
            this.showSuccess('user.messages.deleteSuccess');
            return UserActions.deleteUserSuccess({ id });
          }),
          catchError((error) => {
            this.showError('user.messages.deleteError');
            return of(UserActions.deleteUserFailure({ error }));
          })
        )
      )
    )
  );

  setActiveStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setActiveStatus),
      exhaustMap(({ id, active }) =>
        this.userService.setUserActiveStatus(id, active).pipe(
          map((user) => {
            this.showSuccess(
              active
                ? 'user.messages.activateSuccess'
                : 'user.messages.deactivateSuccess'
            );
            return UserActions.setActiveStatusSuccess({ user });
          }),
          catchError((error) => {
            this.showError(
              active
                ? 'user.messages.activateError'
                : 'user.messages.deactivateError'
            );
            return of(UserActions.setActiveStatusFailure({ error }));
          })
        )
      )
    )
  );

  // Helper method to show success messages
  private showSuccess(key: string): void {
    this.snackBar.open(
      this.transloco.translate(key),
      this.transloco.translate('common.actions.close'),
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  // Helper method to show error messages
  private showError(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
