import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import {
  UserResponse,
  UpdateUserRequest,
} from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    BaseButtonComponent,
  ],
})
export class UpdateUserDetailsComponent implements OnInit, OnDestroy {
  @Input() user!: UserResponse;

  updateForm!: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.updateForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      isWardLevelUser: [this.user.isWardLevelUser],
      wardNumber: [
        {
          value: this.user.wardNumber,
          disabled: !this.user.isWardLevelUser,
        },
        [Validators.min(1), Validators.max(33)],
      ],
    });

    // Handle ward level user changes
    this.updateForm
      .get('isWardLevelUser')
      ?.valueChanges.subscribe((isWardLevel) => {
        const wardControl = this.updateForm.get('wardNumber');
        if (isWardLevel) {
          wardControl?.enable();
        } else {
          wardControl?.disable();
          wardControl?.setValue(null);
        }
      });
  }

  onCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.getRawValue();
      const request: UpdateUserRequest = {
        email: formValue.email,
        isWardLevelUser: formValue.isWardLevelUser,
        wardNumber: formValue.isWardLevelUser ? formValue.wardNumber : null,
      };

      this.store.dispatch(
        UserActions.updateUser({
          id: this.user.id,
          request,
        })
      );

      // Subscribe to the success action to navigate back
      this.store
        .select(UserSelectors.selectUserErrors)
        .pipe(
          takeUntil(this.destroy$),
          filter((errors) => !errors)
        )
        .subscribe(() => {
          this.location.back();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
