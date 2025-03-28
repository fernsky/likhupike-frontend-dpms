import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const authGuard = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        const currentUrl = router.url;

        // If already on an auth route, don't redirect
        if (currentUrl.startsWith('/auth/')) {
          // Allow access to auth routes even when not authenticated
          return true;
        }

        // Otherwise redirect to login
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};
