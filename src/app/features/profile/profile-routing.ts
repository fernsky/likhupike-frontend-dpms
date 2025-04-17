import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'location',
    loadChildren: () =>
      import('./location/location-routing').then((m) => m.LOCATION_ROUTES),
    canActivate: [authGuard],
    data: {
      breadcrumb: 'common.location',
    },
  },
  // Add more profile sections as needed (e.g., demographics, resources, etc.)
  {
    path: '',
    redirectTo: 'location',
    pathMatch: 'full',
  },
];
