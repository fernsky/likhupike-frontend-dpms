import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserCreateComponent } from './user-create.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserCreateComponent,
      },
    ]),
    BreadcrumbComponent,
    UserFormComponent,
    MatProgressBarModule,
    PageTitleComponent,
    UserCreateComponent,
  ],
})
export class UserCreateModule {}
