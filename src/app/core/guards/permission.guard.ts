import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectUserPermissions } from '../store/auth/auth.selectors';
import { PermissionType } from '../models/permission.enum';

export const PermissionGuard = (
  route: ActivatedRouteSnapshot
): Observable<boolean> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectUserPermissions).pipe(
    map((permissions) => Array.from(permissions)), // Convert Set to Array
    take(1),
    map((userPermissions: PermissionType[]) => {
      // Get the permissions from route data
      const requiredPermissions = route.data[
        'permissions'
      ] as Array<PermissionType>;

      // If no permissions are required or user has no permissions, deny access
      if (!requiredPermissions?.length || !userPermissions?.length) {
        router.navigate(['/dashboard']);
        return false;
      }

      // Check if user has all required permissions
      const hasPermission = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasPermission) {
        router.navigate(['/dashboard']);
      }

      return hasPermission;
    })
  );
};
