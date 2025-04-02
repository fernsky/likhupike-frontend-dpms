import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserCreateComponent } from './user-create.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';

// Carbon imports
import {
  ButtonModule,
  LoadingModule,
  ProgressBarModule,
  UIShellModule,
} from 'carbon-components-angular';

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
    // Components
    BreadcrumbComponent,
    UserFormComponent,
    PageTitleComponent,
    UserCreateComponent,
    // Carbon modules
    ButtonModule,
    LoadingModule,
    ProgressBarModule,
    UIShellModule,
  ],
})
export class UserCreateModule {}
