import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const publicGuard = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      // If authenticated, redirect to dashboard
      if (isAuthenticated) {
        return router.createUrlTree(['/dashboard']);
      }

      // Allow all non-authenticated access
      return true;
    })
  );
};
