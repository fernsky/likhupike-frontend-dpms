import { Routes } from '@angular/router';
import { PermissionGuard } from '@app/core/guards/permission.guard';
import { PermissionType } from '@app/core/models/permission.enum';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { USER_FEATURE_KEY, userReducer } from './store/user.reducer';
import { UserEffects } from './store/user.effects';

export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(USER_FEATURE_KEY, userReducer),
      provideEffects(UserEffects),
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionType.VIEW_USER],
          breadcrumb: {
            translationKey: 'user.list.breadcrumb.users',
            path: '/dashboard/users/list',
          },
        },
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/user-create/user-create.module').then(
            (m) => m.UserCreateModule
          ),
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionType.CREATE_USER],
          breadcrumb: {
            translationKey: 'user.create.title',
            path: '/dashboard/users/create',
          },
        },
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./pages/user-edit/user-edit.component').then(
            (m) => m.UserEditComponent
          ),
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionType.EDIT_USER],
          breadcrumb: {
            translationKey: 'user.edit.title',
            dynamic: true,
          },
        },
      },
    ],
  },
];
