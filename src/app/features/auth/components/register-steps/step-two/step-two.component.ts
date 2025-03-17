import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseStepComponent } from '../base-step.component';
import {
  UserType,
  USER_TYPE_TRANSLATION_KEYS,
} from '@app/core/models/user-type.enum';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { selectStepFormData } from '../../../store/register-form.selectors';
import { Store } from '@ngrx/store';
import { RegisterFormState } from '../../../store/register-form.state';
import { RegisterFormActions } from '../../../store/register-form.actions';

@Component({
  selector: 'app-register-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatIconModule,
    MatError,
    TranslocoPipe,
  ],
})
export class StepTwoComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 2;
  @Output() override stepValid = new EventEmitter<boolean>();

  readonly userTypes = Object.values(UserType);
  readonly userTypeTranslationKeys = USER_TYPE_TRANSLATION_KEYS;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    protected override store: Store
  ) {
    super();
    this.initForm();
  }

  private initForm(): void {
    this.stepForm = this.fb.group({
      userType: [UserType.CITIZEN, [Validators.required]],
    });
    this.updateStepValidity();
  }

  ngOnInit(): void {
    this.store
      .select(selectStepFormData(2))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: { userType?: UserType } | null) => {
          if (data && 'userType' in data) {
            this.stepForm.patchValue(data, { emitEvent: false });
          } else {
            this.stepForm.patchValue(
              { userType: UserType.CITIZEN },
              { emitEvent: false }
            );
          }
          this.updateStepValidity();
        },
        error: (error) => {
          console.error('Error loading form data:', error);
          this.stepForm.patchValue(
            { userType: UserType.CITIZEN },
            { emitEvent: false }
          );
          this.updateStepValidity();
        },
      });

    this.stepForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStepValidity();
      if (this.stepForm.valid && this.stepForm.dirty) {
        this.store.dispatch(
          RegisterFormActions.updateFormData({
            formData: { userType: this.stepForm.get('userType')?.value },
          })
        );
        this.updateFormData();
      }
    });
  }

  protected override updateStepValidity(): void {
    const isValid = this.stepForm.valid && this.stepForm.get('userType')?.value;
    this.store.dispatch(
      RegisterFormActions.updateStepValidity({
        step: this.stepNumber,
        isValid,
      })
    );
    this.stepValid.emit(isValid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
