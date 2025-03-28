import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectIsAuthenticated,
  selectUserPermissions,
  selectIsLoading,
  selectAuthError,
  selectIsInitialized,
} from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  // Public observables
  isAuthenticated$: Observable<boolean> = this.store.select(
    selectIsAuthenticated
  );
  isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
  isInitialized$: Observable<boolean> = this.store.select(selectIsInitialized);
  error$: Observable<string | null> = this.store.select(selectAuthError);
  userPermissions$ = this.store.select(selectUserPermissions);

  authState$: Observable<AuthState> = this.store.select((state) => ({
    isAuthenticated: selectIsAuthenticated(state),
    isLoading: selectIsLoading(state),
    isInitialized: selectIsInitialized(state),
    error: selectAuthError(state),
  }));

  constructor(private store: Store) {}

  // Auth initialization
  initializeAuth(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }

  // Auth actions
  login(credentials: { email: string; password: string }): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  // Additional helper methods
  clearErrors(): void {
    // Implement if needed to clear auth errors
  }
}
