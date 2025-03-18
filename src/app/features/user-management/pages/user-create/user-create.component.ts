import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserActions } from '../../store/user.actions';
import { CreateUserRequest } from '../../models/user.interface';
import * as UserSelectors from '../../store/user.selectors';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    TranslocoModule,
    UserFormComponent,
    BreadcrumbComponent,
    PageTitleComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
      alias: 'user',
    }),
    PasswordValidatorService,
  ],
})
export class UserCreateComponent implements OnDestroy {
  loading$ = this.store.select(UserSelectors.selectUserCreating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {
    // Clear any existing errors when component initializes
    this.store.dispatch(UserActions.clearUserErrors());
  }

  onSubmit(request: CreateUserRequest): void {
    this.store.dispatch(UserActions.createUser({ request }));

    this.store
      .select(UserSelectors.selectUserCreating)
      .pipe(
        takeUntil(this.destroy$),
        filter((creating) => !creating)
      )
      .subscribe(() => {
        this.store
          .select(UserSelectors.selectUserErrors)
          .pipe(
            takeUntil(this.destroy$),
            filter((errors) => !errors || Object.keys(errors).length === 0)
          )
          .subscribe(() => {
            this.navigateBack();
          });
      });
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/dashboard/users/list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
