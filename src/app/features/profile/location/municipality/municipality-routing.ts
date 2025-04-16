import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';
import { PermissionGuard } from '@app/core/guards/permission.guard';
import { MunicipalityProfileComponent } from './pages/municipality-profile/municipality-profile.component';
import { unsavedChangesGuard } from '@app/core/guards/unsaved-changes.guard';


export const MUNICIPALITY_ROUTES: Routes = [
  {
    path: '',
    component: MunicipalityProfileComponent,
    canActivate: [authGuard, PermissionGuard],
    canDeactivate: [unsavedChangesGuard],
    data: {
      permissions: ['MANAGE_MUNICIPALITY_PROFILE'],
      breadcrumb: 'municipality.profile.breadcrumb'
    }
  }
];
