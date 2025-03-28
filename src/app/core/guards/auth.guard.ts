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
        // Redirect to login if trying to access protected routes
        console.log('User is not authenticated, redirecting to login page.');
        return router.createUrlTree(['/auth/login']);
      }
      console.log('Hit the auth guard');
      return true;
    })
  );
};
