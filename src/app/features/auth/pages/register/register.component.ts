import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, take, map } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { selectAuthState } from '@app/core/store/auth/auth.selectors';
import { RegisterRequest } from '@app/core/models/auth.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StepOneComponent } from '../../components/register-steps/step-one/step-one.component';
import { StepTwoComponent } from '../../components/register-steps/step-two/step-two.component';
import { StepThreeComponent } from '../../components/register-steps/step-three/step-three.component';
import { StepFourComponent } from '../../components/register-steps/step-four/step-four.component';
import { RegisterFormActions } from '../../store/register-form.actions';
import {
  selectCurrentStep,
  selectFormData,
  selectCanProceedToNextStep,
  selectIsLastStep,
  selectStepValidities,
} from '../../store/register-form.selectors';
import {
  StepIndicatorComponent,
  Step,
} from '@app/shared/components/step-indicator/step-indicator.component';
import { GovBrandingComponent } from '@app/shared/components/gov-branding/gov-branding.component';
import { SystemFeaturesComponent } from '@app/shared/components/system-features/system-features.component';
import { BackgroundParticlesComponent } from '@app/shared/components/background-particles/background-particles.component';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseAuthComponent } from '../../components/base-auth/base-auth.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepIndicatorComponent,
    GovBrandingComponent,
    SystemFeaturesComponent,
    BackgroundParticlesComponent,
    MatIcon,
    TranslocoPipe,
  ],
})
export class RegisterComponent
  extends BaseAuthComponent
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<void>();
  currentStep$ = this.store.select(selectCurrentStep).pipe(
    map((step) => step || 1) // Provide default value
  );
  canProceedToNextStep$ = this.store.select(selectCanProceedToNextStep);
  isLastStep$ = this.store.select(selectIsLastStep);
  loading = false;

  steps: Step[] = [
    {
      label: 'registration.steps.personal.label',
      description: 'registration.steps.personal.description',
      icon: 'person',
      completed: false,
      current: true,
      valid: false,
    },
    {
      label: 'registration.steps.role.label',
      description: 'registration.steps.role.description',
      icon: 'badge',
      completed: false,
      current: false,
      valid: false,
    },
    {
      label: 'registration.steps.location.label',
      description: 'registration.steps.location.description',
      icon: 'location_on',
      completed: false,
      current: false,
      valid: false,
    },
    {
      label: 'registration.steps.account.label',
      description: 'registration.steps.account.description',
      icon: 'lock',
      completed: false,
      current: false,
      valid: false,
    },
  ];

  steps$ = combineLatest([
    this.currentStep$,
    this.store.select(selectStepValidities), // Add this selector
  ]).pipe(
    map(([currentStep, validities]) =>
      this.steps.map((step, index) => ({
        ...step,
        completed: index < currentStep - 1,
        current: index === currentStep - 1,
        valid: validities[index],
      }))
    )
  );

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    // Reset form state when component initializes
    this.store.dispatch(RegisterFormActions.resetForm());

    // Monitor auth state for loading and errors
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        if (authState) {
          this.loading = authState.isLoading;
        }
      });
  }

  handlePreviousStep(): void {
    this.currentStep$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((step) => {
        this.store.dispatch(
          RegisterFormActions.previousStep({ currentStep: step })
        );
      });
  }

  handleNextStep(): void {
    this.currentStep$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((step) => {
        this.store.dispatch(
          RegisterFormActions.nextStep({ currentStep: step })
        );
      });
  }

  onNextStep(currentStep: number): void {
    this.store.dispatch(RegisterFormActions.nextStep({ currentStep }));
  }

  onPreviousStep(currentStep: number): void {
    this.store.dispatch(RegisterFormActions.previousStep({ currentStep }));
  }

  onSubmit(): void {
    this.store
      .select(selectFormData)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((formData) => {
        if (formData) {
          const registerData: RegisterRequest = {
            fullName: formData.fullName,
            fullNameNepali: formData.fullNameNepali,
            email: formData.email,
            password: formData.password,
            userType: formData.userType,
            // Location based on user type
            ...(formData.location &&
              Object.fromEntries(
                Object.entries(formData.location).filter(
                  ([_, v]) => v !== undefined
                )
              )),
            ...(formData.employeeInfo &&
              Object.fromEntries(
                Object.entries(formData.employeeInfo).filter(
                  ([_, v]) => v !== undefined
                )
              )),
            ...(formData.electedRepInfo &&
              Object.fromEntries(
                Object.entries(formData.electedRepInfo).filter(
                  ([_, v]) => v !== undefined
                )
              )),
            address: 'Not available',
            dateOfBirth: '1800-01-01',
            officePost: 'Other',
          };
          this.store.dispatch(AuthActions.register({ userData: registerData }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
