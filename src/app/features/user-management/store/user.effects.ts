import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';
import * as UserSelectors from './user.selectors';
import { UrlParamsService } from '../services/url-params.service';
import { GlobalNotificationService } from '../../../core/services/global-notification.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private transloco: TranslocoService,
    private router: Router,
    private store: Store,
    private urlParamsService: UrlParamsService,
    private globalNotificationService: GlobalNotificationService
  ) {}

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      exhaustMap(({ request }) =>
        this.userService.createUser(request).pipe(
          map(({ user, message }) => {
            this.showSuccess(message);
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
            return UserActions.loadUsersSuccess({
              users,
              total,
              meta: {
                page: filter.page ?? 1,
                size: filter.size ?? 10,
                totalElements: total,
                totalPages: Math.ceil(total / (filter.size ?? 10)),
                isFirst: (filter.page ?? 1) === 1,
                isLast:
                  (filter.page ?? 1) >= Math.ceil(total / (filter.size ?? 10)),
              },
            });
          }),
          catchError((error) => {
            return of(
              UserActions.loadUsersFailure({
                error: {
                  ...error,
                  status: error.status || 500,
                },
              })
            );
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
            this.showSuccess(message);
            return UserActions.updateUserSuccess({ user });
          }),
          catchError((error) => {
            this.showError(error.message);
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
            this.showSuccess(message);
            this.router.navigate(['/dashboard/users/list']);
            return UserActions.deleteUserSuccess({ id });
          }),
          catchError((error) => {
            this.showError(error.message);
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
            this.showSuccess(message);
            return UserActions.approveUserSuccess({ user, message });
          }),
          catchError((error) => {
            this.showError(error.message);
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
      withLatestFrom(this.store.select(UserSelectors.selectCurrentFilter)),
      map(([{ filter }, currentFilter]) => {
        const newFilter = {
          ...currentFilter,
          ...filter,
          page:
            filter.page ??
            (Object.keys(filter).length > 0 ? 1 : (currentFilter.page ?? 1)),
          size: filter.size ?? currentFilter.size ?? 10,
          sortBy: filter.sortBy ?? currentFilter.sortBy ?? 'createdAt',
          sortDirection:
            filter.sortDirection ?? currentFilter.sortDirection ?? 'DESC',
        };
        return UserActions.loadUsers({ filter: newFilter });
      })
    )
  );

  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setPage),
      map(({ pageIndex, pageSize }) => {
        const filter = { page: pageIndex, size: pageSize };
        return UserActions.filterChange({ filter });
      })
    )
  );

  resetFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.resetFilters),
      map(() => {
        const defaultFilter = {
          page: 1,
          size: 10,
          sortBy: 'createdAt',
          sortDirection: 'DESC' as 'ASC' | 'DESC',
        };
        return UserActions.loadUsers({ filter: defaultFilter });
      })
    )
  );

  private showSuccess(message: string): void {
    this.globalNotificationService.showNotification({
      type: 'success',
      title: 'Success',
      message: message,
      duration: 3000,
    });
  }

  private showError(message: string): void {
    this.globalNotificationService.showNotification({
      type: 'error',
      title: 'Error',
      message: message,
      duration: 5000,
    });
  }
}
