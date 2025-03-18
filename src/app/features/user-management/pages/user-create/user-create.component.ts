import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserActions } from '../../store/user.actions';
import { CreateUserRequest } from '../../models/user.interface';
import * as UserSelectors from '../../store/user.selectors';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';
import { PermissionType } from '@app/core/models/permission.enum';

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
export class UserCreateComponent implements OnInit, OnDestroy {
  loading$ = this.store.select(UserSelectors.selectUserCreating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Clear any existing errors
    this.store.dispatch(UserActions.clearErrors());

    // Subscribe to creation status
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
            take(1),
            filter((errors) => !errors)
          )
          .subscribe(() => {
            this.router.navigate(['/dashboard/users/list']);
          });
      });
  }

  onSubmit(request: CreateUserRequest): void {
    console.log('CreateComponent received request:', request);

    // Ensure all required permissions are initialized
    const formattedRequest: CreateUserRequest = {
      email: request.email,
      password: request.password,
      isWardLevelUser: request.isWardLevelUser,
      wardNumber: request.isWardLevelUser ? request.wardNumber : null,
      permissions: Object.values(PermissionType).reduce(
        (acc, permission) => ({
          ...acc,
          [permission]: Boolean(request.permissions?.[permission]),
        }),
        {} as { [key in PermissionType]: boolean }
      ),
    };

    console.log('Dispatching formatted request:', formattedRequest);
    this.store.dispatch(UserActions.createUser({ request: formattedRequest }));
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
