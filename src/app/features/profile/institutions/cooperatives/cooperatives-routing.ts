import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideTranslocoScope } from '@jsverse/transloco';
import { authGuard } from '@app/core/guards/auth.guard';
import { PermissionGuard } from '@app/core/guards/permission.guard';
import { unsavedChangesGuard } from '@app/core/guards/unsaved-changes.guard';

import {
  COOPERATIVES_FEATURE_KEY,
  cooperativesFeatureReducer,
} from './store/reducers';
import { effects as CooperativeEffects } from './store/effects';
import { CooperativeListPageComponent } from './pages/list/cooperative-list-page.component';
import { CooperativeCreatePageComponent } from './pages/create/cooperative-create-page.component';
import { CooperativeEditPageComponent } from './pages/edit/cooperative-edit-page.component';
import { CooperativeViewPageComponent } from './pages/view/cooperative-view-page.component';

export const COOPERATIVES_ROUTES: Routes = [
  {
    path: '',
    component: CooperativeListPageComponent,
    providers: [
      provideState(COOPERATIVES_FEATURE_KEY, cooperativesFeatureReducer),
      provideEffects(CooperativeEffects),
      provideTranslocoScope({
        scope: 'cooperatives',
        alias: 'cooperative',
      }),
    ],
    canActivate: [authGuard, PermissionGuard],
    data: {
      permissions: ['VIEW_COOPERATIVES'],
      breadcrumb: 'cooperative.breadcrumb.list',
    },
  },
  {
    path: 'create',
    component: CooperativeCreatePageComponent,
    canActivate: [authGuard, PermissionGuard],
    canDeactivate: [unsavedChangesGuard],
    data: {
      permissions: ['MANAGE_COOPERATIVES'],
      breadcrumb: 'cooperative.breadcrumb.create',
    },
  },
  {
    path: 'edit/:id',
    component: CooperativeEditPageComponent,
    canActivate: [authGuard, PermissionGuard],
    canDeactivate: [unsavedChangesGuard],
    data: {
      permissions: ['MANAGE_COOPERATIVES'],
      breadcrumb: 'cooperative.breadcrumb.edit',
    },
  },
  {
    path: ':id',
    component: CooperativeViewPageComponent,
    canActivate: [authGuard, PermissionGuard],
    data: {
      permissions: ['VIEW_COOPERATIVES'],
      breadcrumb: 'cooperative.breadcrumb.view',
    },
  },
];
