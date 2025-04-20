import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'location',
    data: {
      breadcrumb: {
        translationKey: 'location',
        icon: 'location_on',
        path: '/dashboard/profile/location',
      },
    },
    loadChildren: () =>
      import('./location/location-routing').then((m) => m.LOCATION_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'cooperatives',
    data: {
      breadcrumb: {
        translationKey: 'cooperatives',
        icon: 'business',
        path: '/dashboard/profile/cooperatives',
      },
    },
    loadChildren: () =>
      import('./institutions/cooperatives/cooperatives-routing').then(
        (m) => m.COOPERATIVES_ROUTES
      ),
  },
  // Add more profile sections as needed (e.g., demographics, resources, etc.)
  {
    path: '',
    redirectTo: 'location',
    pathMatch: 'full',
  },
];
