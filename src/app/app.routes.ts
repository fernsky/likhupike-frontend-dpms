import { Routes } from '@angular/router';
import { RoleType } from './core/models/role.enum';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: {
      roles: [RoleType.SUPER_ADMIN, RoleType.MUNICIPALITY_ADMIN],
    },
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
