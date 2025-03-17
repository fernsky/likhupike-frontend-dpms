import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RegisterFormActions } from '../../store/register-form.actions';

@Component({ template: '' })
export abstract class BaseStepComponent {
  protected store = inject(Store);
  abstract stepForm: FormGroup;
  abstract stepNumber: number;
  @Output() stepValid = new EventEmitter<boolean>();

  protected updateStepValidity(): void {
    this.store.dispatch(
      RegisterFormActions.updateStepValidity({
        step: this.stepNumber,
        isValid: this.stepForm.valid,
      })
    );
  }

  protected updateFormData(): void {
    if (this.stepForm.valid) {
      this.store.dispatch(
        RegisterFormActions.updateFormData({
          formData: this.stepForm.value,
        })
      );
    }
  }
}
