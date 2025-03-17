import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { UserListComponent } from './user-list.component';

const routes = [
  {
    path: '',
    component: UserListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
})
export class UserListModule {}
