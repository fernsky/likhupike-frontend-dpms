import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, filter, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@jsverse/transloco';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserActions } from '../../store/user.actions';
import { UpdateUserRequest } from '../../models/user.interface';
import * as UserSelectors from '../../store/user.selectors';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    TranslocoModule,
    UserFormComponent,
    BreadcrumbComponent,
  ],
})
export class UserEditComponent implements OnInit, OnDestroy {
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  user$ = this.store.select(UserSelectors.selectSelectedUser);
  private destroy$ = new Subject<void>();
  private userId: string = '';

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(UserActions.clearErrors());

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['id'];
      if (this.userId) {
        this.store.dispatch(UserActions.loadUser({ id: this.userId }));
      } else {
        this.navigateBack();
      }
    });

    this.store
      .select(UserSelectors.selectUserUpdating)
      .pipe(
        takeUntil(this.destroy$),
        filter((updating) => !updating)
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

  onSubmit(request: UpdateUserRequest): void {
    // Convert any undefined values to null to match Kotlin nullable types
    const nullableRequest: UpdateUserRequest = {
      email: request.email ?? null,
      isWardLevelUser: request.isWardLevelUser ?? null,
      wardNumber: request.wardNumber ?? null,
    };

    this.store.dispatch(
      UserActions.updateUser({
        id: this.userId,
        request: nullableRequest,
      })
    );

    // Subscribe to update completion
    this.store
      .select(UserSelectors.selectUserErrors)
      .pipe(
        takeUntil(this.destroy$),
        filter((errors) => !errors)
      )
      .subscribe(() => {
        this.navigateBack();
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
