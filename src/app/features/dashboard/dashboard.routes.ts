import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DashboardComponent,
    data: {
      breadcrumb: {
        translationKey: 'dashboard',
        icon: 'dashboard',
        path: '/dashboard',
      },
    },
    children: [
      {
        path: 'users',
        data: {
          breadcrumb: {
            translationKey: 'users',
            icon: 'group',
            path: '/dashboard/users',
          },
        },
        loadChildren: () =>
          import('../user-management/user-management.routes').then(
            (m) => m.USER_MANAGEMENT_ROUTES
          ),
      },
    ],
  },
];
