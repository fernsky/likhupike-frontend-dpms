import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  TranslocoModule,
  TranslocoService,
  provideTranslocoScope,
} from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { UserResponse } from '../../models/user.interface';
import { UserActions } from '../../store/user.actions';
import * as UserSelectors from '../../store/user.selectors';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';
import { UpdateUserDetailsComponent } from './components/update-user-details/update-user-details.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserPermissionsComponent } from './components/user-permissions/user-permissions.component';

// Carbon imports
import {
  ButtonModule,
  TabsModule,
  LoadingModule,
  NotificationModule,
  UIShellModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatIconModule,
    BreadcrumbComponent,
    PageTitleComponent,
    UpdateUserDetailsComponent,
    ResetPasswordComponent,
    UserPermissionsComponent,

    // Carbon modules
    ButtonModule,
    TabsModule,
    LoadingModule,
    NotificationModule,
    UIShellModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'user-management',
      alias: 'user',
    }),
  ],
})
export class UserEditComponent implements OnInit, OnDestroy {
  loading$ = this.store.select(UserSelectors.selectUserLoading);
  user$ = this.store.select(UserSelectors.selectSelectedUser);
  error$ = this.store.select(UserSelectors.selectUserErrors);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.clearErrors());

    // Load user data based on the ID from the route
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        this.store.dispatch(UserActions.loadUser({ id: params['id'] }));
      }
    });
  }

  onBack(): void {
    this.location.back();
  }

  getPageTitle(user: UserResponse | null): string {
    return (
      user?.email || this.transloco.translate('user.edit.title', { email: '' })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
