import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
} from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { provideTranslocoConfig } from './core/config/transloco.config';
import { API_CONFIG, DEFAULT_API_CONFIG } from './core/api/config/api.config';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authReducer } from './core/store/auth/auth.reducer';
import { AuthFacade } from './core/facades/auth.facade';
import { apiInterceptor } from './core/interceptors/api.interceptor';

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withDebugTracing()),
    provideAnimations(),
    provideHttpClient(withInterceptors([apiInterceptor, authInterceptor])),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
    provideClientHydration(),
    importProvidersFrom(MatIconModule),
    importProvidersFrom(MatSnackBarModule),
    {
      provide: 'MAT_DEFAULT_OPTIONS',
      useValue: {
        typography: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    {
      provide: API_CONFIG,
      useValue: DEFAULT_API_CONFIG,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      },
    },
    AuthFacade,
    ...provideTranslocoConfig(),
  ],
};
