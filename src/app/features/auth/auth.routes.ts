import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideNativeDateAdapter } from '@angular/material/core';
import { authReducer } from '@app/core/store/auth/auth.reducer';
import {
  API_CONFIG,
  DEFAULT_API_CONFIG,
} from '@app/core/api/config/api.config';
import { provideTranslocoScope } from '@jsverse/transloco';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { BaseAuthComponent } from './components/base-auth/base-auth.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: BaseAuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
        providers: [
          provideTranslocoScope({
            scope: 'login',
            alias: 'login',
          }),
        ],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        providers: [
          provideState({ name: 'auth', reducer: authReducer }),
          {
            provide: API_CONFIG,
            useValue: DEFAULT_API_CONFIG,
          },
          provideNativeDateAdapter(),
          provideTranslocoScope({
            scope: 'registration',
            alias: 'register',
          }),
        ],
      },
      {
        path: 'forgot-password',
        canDeactivate: [
          (component: ForgotPasswordComponent) => {
            component.store.dispatch(AuthActions.clearForgotPasswordState());
            return true;
          },
        ],
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
        providers: [
          provideTranslocoScope({
            scope: 'forgot-password',
            alias: 'forgotPassword',
          }),
        ],
      },
    ],
  },
];
