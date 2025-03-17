import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectIsAuthenticated,
  selectUserPermissions,
  selectIsLoading,
  selectAuthError,
} from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  isAuthenticated$: Observable<boolean> = this.store.select(
    selectIsAuthenticated
  );
  isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
  error$: Observable<string | null> = this.store.select(selectAuthError);
  userPermissions$ = this.store.select(selectUserPermissions);

  authState$: Observable<AuthState> = this.store.select((state) => ({
    isAuthenticated: selectIsAuthenticated(state),
    isLoading: selectIsLoading(state),
    error: selectAuthError(state),
  }));

  constructor(private store: Store) {
    this.initializeAuth();
  }

  initializeAuth(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }

  login(credentials: { email: string; password: string }): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
