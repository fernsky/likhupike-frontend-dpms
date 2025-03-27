import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';
import * as UserSelectors from './user.selectors';

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
          map(({ users, total }) => {
            const validMeta = {
              page: filter.page ?? 1, // Use the filter's page number
              size: filter.size ?? 10,
              totalElements: total,
              totalPages: Math.ceil(total / (filter.size ?? 10)),
              isFirst: (filter.page ?? 1) === 1,
              isLast:
                (filter.page ?? 1) >= Math.ceil(total / (filter.size ?? 10)),
            };
            console.log(validMeta);
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
          map((response) => {
            this.showSuccess(response.message);
            return UserActions.resetUserPasswordSuccess({
              user: response.user,
            });
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

  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.filterChange),
      map(({ filter }) => {
        // Reset to page 1 when filters change
        const newFilter = { ...filter, page: 1 };
        return UserActions.loadUsers({ filter: newFilter });
      })
    )
  );

  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setPage),
      withLatestFrom(this.store.select(UserSelectors.selectCurrentFilter)),
      map(([{ pageIndex, pageSize }, currentFilter]) => {
        const newFilter = {
          ...currentFilter,
          page: pageIndex,
          size: pageSize,
        };
        return UserActions.loadUsers({ filter: newFilter });
      })
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
