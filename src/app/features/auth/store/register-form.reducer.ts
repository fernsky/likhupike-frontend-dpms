import { createReducer, on } from '@ngrx/store';
import { RegisterFormActions } from './register-form.actions';
import {
  initialRegisterFormState,
  RegisterFormState,
} from './register-form.state';

export const registerFormReducer = createReducer(
  initialRegisterFormState,

  on(
    RegisterFormActions.updateStepValidity,
    (state, { step, isValid }): RegisterFormState => {
      const stepKey = `step${step}` as keyof typeof state.isValid;
      return {
        ...state,
        isValid: {
          ...state.isValid,
          [stepKey]: isValid,
        },
      };
    }
  ),

  on(
    RegisterFormActions.nextStep,
    (state, { currentStep }): RegisterFormState => {
      const nextStep = Math.min(state.totalSteps, currentStep + 1);
      return {
        ...state,
        currentStep: nextStep,
      };
    }
  ),

  on(
    RegisterFormActions.previousStep,
    (state, { currentStep }): RegisterFormState => {
      const prevStep = Math.max(1, currentStep - 1);
      return {
        ...state,
        currentStep: prevStep,
      };
    }
  ),

  on(
    RegisterFormActions.updateFormData,
    (state, { formData }): RegisterFormState => {
      if (formData.userType && formData.userType !== state.formData.userType) {
        // Clear location related data when user type changes
        return {
          ...state,
          formData: {
            ...state.formData,
            ...formData,
            location: undefined,
            employeeInfo: undefined,
            electedRepInfo: undefined,
          },
        };
      }
      return {
        ...state,
        formData: {
          ...state.formData,
          ...formData,
        },
      };
    }
  ),

  on(
    RegisterFormActions.resetForm,
    (): RegisterFormState => ({
      ...initialRegisterFormState,
    })
  ),

  on(
    RegisterFormActions.updateLocationInfo,
    (state, { locationInfo }): RegisterFormState => ({
      ...state,
      formData: {
        ...state.formData,
        location: locationInfo,
      },
    })
  ),

  on(
    RegisterFormActions.updateEmployeeInfo,
    (state, { employeeInfo }): RegisterFormState => ({
      ...state,
      formData: {
        ...state.formData,
        employeeInfo,
      },
    })
  ),

  on(
    RegisterFormActions.updateElectedRepInfo,
    (state, { electedRepInfo }): RegisterFormState => ({
      ...state,
      formData: {
        ...state.formData,
        electedRepInfo,
      },
    })
  ),

  on(
    RegisterFormActions.clearLocationData,
    (state): RegisterFormState => ({
      ...state,
      formData: {
        ...state.formData,
        location: undefined,
        employeeInfo: undefined,
        electedRepInfo: undefined,
      },
    })
  )
);
