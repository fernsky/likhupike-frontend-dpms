import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { UserListComponent } from './user-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: UserListComponent,
      },
    ]),
    // Import the component itself since it's standalone
    UserListComponent,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
})
export class UserListModule {}
