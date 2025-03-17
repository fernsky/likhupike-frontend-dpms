import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { registerFormReducer } from './store/register-form.reducer';
import { provideNativeDateAdapter } from '@angular/material/core';
import { authReducer } from '@app/core/store/auth/auth.reducer';
import {
  API_CONFIG,
  DEFAULT_API_CONFIG,
} from '@app/core/api/config/api.config';
import { publicGuard } from '@app/core/guards/public.guard';
import { provideTranslocoScope } from '@jsverse/transloco';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
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
    canActivate: [publicGuard],
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
      provideState({ name: 'registerForm', reducer: registerFormReducer }),
      provideNativeDateAdapter(),
      provideTranslocoScope({
        scope: 'registration',
        alias: 'registration',
      }),
    ],
  },
  {
    path: 'forgot-password',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
