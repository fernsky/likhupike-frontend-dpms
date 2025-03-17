import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserCreateComponent } from './user-create.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';

const routes = [
  {
    path: '',
    component: UserCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), UserFormComponent],
})
export class UserCreateModule {}
