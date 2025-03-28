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
      // Only redirect authenticated users to dashboard and allow all
      // non-authenticated users to access any auth routes
      if (isAuthenticated) {
        return router.createUrlTree(['/dashboard']);
      }
      console.log('Hit the public guard!!');
      // Return true for all auth routes if user is not authenticated
      return true;
    })
  );
};
