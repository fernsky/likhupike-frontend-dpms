import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { UserActions } from './user.actions';
import { UserService } from '../services/user.service';
import * as AuthSelectors from '@app/core/store/auth/auth.selectors';

@Injectable()
export class UserEffects {
  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.createUser),
      withLatestFrom(this.store.select(AuthSelectors.selectMunicipality)),
      exhaustMap(([action, municipality]) =>
        this.userService.createUser(action.request, municipality?.code).pipe(
          map((user) => {
            this.showSuccess('messages.createSuccess');
            return UserActions.createUserSuccess({ user });
          }),
          catchError((error) => {
            this.showError('messages.createError');
            return of(UserActions.createUserFailure({ errors: error.errors }));
          })
        )
      )
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      withLatestFrom(this.store.select(AuthSelectors.selectMunicipality)),
      exhaustMap(([action, municipality]) =>
        this.userService.getUsers(action.filter, municipality?.code).pipe(
          map(({ users, total }) =>
            UserActions.loadUsersSuccess({ users, total })
          ),
          catchError((error) => {
            this.showError('messages.loadError');
            return of(UserActions.loadUsersFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      withLatestFrom(this.store.select(AuthSelectors.selectMunicipality)),
      exhaustMap(([action, municipality]) =>
        this.userService
          .updateUser(action.id, action.request, municipality?.code)
          .pipe(
            map((user) => {
              this.showSuccess('messages.updateSuccess');
              return UserActions.updateUserSuccess({ user });
            }),
            catchError((error) => {
              this.showError('messages.updateError');
              return of(
                UserActions.updateUserFailure({ errors: error.errors })
              );
            })
          )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      withLatestFrom(this.store.select(AuthSelectors.selectMunicipality)),
      exhaustMap(([action, municipality]) =>
        this.userService.deleteUser(action.id, municipality?.code).pipe(
          map(() => {
            this.showSuccess('messages.deleteSuccess');
            return UserActions.deleteUserSuccess({ id: action.id });
          }),
          catchError((error) => {
            this.showError('messages.deleteError');
            return of(UserActions.deleteUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  setUserActiveStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setUserActiveStatus),
      withLatestFrom(this.store.select(AuthSelectors.selectMunicipality)),
      exhaustMap(([action, municipality]) =>
        this.userService
          .setUserActiveStatus(action.id, action.active, municipality?.code)
          .pipe(
            map((user) => {
              this.showSuccess(
                action.active
                  ? 'messages.activateSuccess'
                  : 'messages.deactivateSuccess'
              );
              return UserActions.setUserActiveStatusSuccess({ user });
            }),
            catchError((error) => {
              this.showError(
                action.active
                  ? 'messages.activateError'
                  : 'messages.deactivateError'
              );
              return of(
                UserActions.setUserActiveStatusFailure({ error: error.message })
              );
            })
          )
      )
    )
  );

  // Helper method to show success messages
  private showSuccess(key: string): void {
    const message = this.transloco.translate('user.' + key);
    this.snackBar.open(
      message,
      this.transloco.translate('common.actions.close'),
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      }
    );
  }

  // Helper method to show error messages
  private showError(key: string): void {
    const message = this.transloco.translate('user.' + key);
    this.snackBar.open(
      message,
      this.transloco.translate('common.actions.close'),
      {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      }
    );
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}
}
