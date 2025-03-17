import { NgModule } from '@angular/core';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';

@NgModule({
  imports: [TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
})
export class UserFormModule {}
