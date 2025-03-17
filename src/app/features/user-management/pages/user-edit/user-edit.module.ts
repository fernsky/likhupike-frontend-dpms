import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserEditComponent } from './user-edit.component';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '@app/shared/shared.module';

const routes = [
  {
    path: '',
    component: UserEditComponent,
  },
];

@NgModule({
  imports: [
    UserEditComponent,
    CommonModule,
    RouterModule.forChild(routes),
    TranslocoModule,
    MatProgressBarModule,
    SharedModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
})
export class UserEditModule {}
