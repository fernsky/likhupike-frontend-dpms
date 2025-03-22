import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil, combineLatest } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserActions } from '../../store/user.actions';
import * as UserSelectors from '../../store/user.selectors';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';
import { UpdateUserDetailsComponent } from './components/update-user-details/update-user-details.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UserPermissionsComponent } from './components/user-permissions/user-permissions.component';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    TranslocoModule,
    MatProgressBarModule,
    BreadcrumbComponent,
    MatIconModule,
    PageTitleComponent,
    UpdateUserDetailsComponent,
    ResetPasswordComponent,
    UserPermissionsComponent,
    FormSectionComponent,
    BaseButtonComponent,
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
  activeTabIndex = 0;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.clearErrors());

    // Load user data and handle navigation
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        // Clear selected user before loading new one
        this.store.dispatch(UserActions.loadUser({ id: params['id'] }));

        // Monitor the user data and error states
        combineLatest([this.user$, this.loading$])
          .pipe(
            takeUntil(this.destroy$),
            // Wait until loading is complete and we have data or error
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            filter(([_, loading]) => !loading)
          )
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .subscribe(([user, _]) => {
            console.log('User data in component:', user);
            if (!user) {
              console.error('No user data available');
              this.router.navigate(['/dashboard/users/list']);
            }
          });
      }
    });

    // Handle query param for active tab
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.activeTabIndex = parseInt(params['tab'] || '0', 10);
      });
  }

  onBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
