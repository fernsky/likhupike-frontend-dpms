import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectUserRoles } from '../store/auth/auth.selectors';
import { RoleType } from '../models/role.enum';

export const RoleGuard = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectUserRoles).pipe(
    take(1),
    map((userRoles: RoleType[]) => {
      // Get the roles from route data
      const allowedRoles = route.data['roles'] as Array<RoleType>;

      // If no roles are required or user has no roles, deny access
      if (!allowedRoles?.length || !userRoles?.length) {
        router.navigate(['/dashboard']);
        return false;
      }

      // Check if any of user's roles is included in the allowed roles
      const hasPermission = userRoles.some((role) =>
        allowedRoles.includes(role)
      );

      if (!hasPermission) {
        router.navigate(['/dashboard']);
      }

      return hasPermission;
    })
  );
};
