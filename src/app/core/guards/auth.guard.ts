import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take, switchMap } from 'rxjs/operators';
import {
  selectIsAuthenticated,
  selectIsInitialized,
} from '../store/auth/auth.selectors';
import { AuthFacade } from '../facades/auth.facade';

export const authGuard = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);
  const authFacade = inject(AuthFacade);

  // Ensure auth is initialized
  authFacade.initializeAuth();

  return store.select(selectIsInitialized).pipe(
    filter((isInitialized) => isInitialized),
    take(1),
    switchMap(() =>
      store.select(selectIsAuthenticated).pipe(
        take(1),
        map((isAuthenticated) => {
          if (!isAuthenticated) {
            const navigation = router.getCurrentNavigation();
            const currentUrl = navigation?.extractedUrl.toString();

            return router.createUrlTree(['/auth/login'], {
              queryParams: currentUrl ? { returnUrl: currentUrl } : {},
            });
          }
          return true;
        })
      )
    )
  );
};
