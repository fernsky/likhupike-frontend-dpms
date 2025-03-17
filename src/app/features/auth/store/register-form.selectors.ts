import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RegisterFormState } from './register-form.state';
import { UserType } from '@app/core/models/user-type.enum';

export const selectRegisterFormState =
  createFeatureSelector<RegisterFormState>('registerForm');

export const selectCurrentStep = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.currentStep
);

export const selectFormData = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.formData
);

export const selectStepValidity = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.isValid
);

export const selectCanProceedToNextStep = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => {
    const currentStepKey =
      `step${state.currentStep}` as keyof typeof state.isValid;
    return state.isValid[currentStepKey];
  }
);

export const selectIsLastStep = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.currentStep === state.totalSteps
);

export const selectStepFormData = (step: number) =>
  createSelector(selectFormData, (formData) => {
    switch (step) {
      case 1:
        return {
          fullNameNepali: formData.fullNameNepali,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        };
      case 2:
        return { userType: formData.userType };
      case 3:
        const baseLocation = formData.location || {};
        switch (formData.userType) {
          case UserType.LOCAL_LEVEL_EMPLOYEE:
            return formData.employeeInfo || baseLocation;
          case UserType.ELECTED_REPRESENTATIVE:
            return formData.electedRepInfo || baseLocation;
          default:
            return baseLocation;
        }
      case 4:
        return {
          email: formData.email,
          password: formData.password,
        };
      default:
        return {};
    }
  });

export const selectStepValidities = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => [
    state.isValid.step1,
    state.isValid.step2,
    state.isValid.step3,
  ]
);

export const selectLocationInfo = createSelector(
  selectFormData,
  (formData) => formData.location
);

export const selectEmployeeInfo = createSelector(
  selectFormData,
  (formData) => formData.employeeInfo
);

export const selectElectedRepInfo = createSelector(
  selectFormData,
  (formData) => formData.electedRepInfo
);

export const selectLocationValidationErrors = createSelector(
  selectFormData,
  (formData) => {
    const errors: string[] = [];
    if (!formData.location?.provinceCode) {
      errors.push('Province is required');
    }
    if (!formData.location?.districtCode) {
      errors.push('District is required');
    }
    if (!formData.location?.municipalityCode) {
      errors.push('Municipality is required');
    }
    if (
      (formData.userType === UserType.CITIZEN ||
        formData.electedRepInfo?.position === 'WARD_CHAIRPERSON' ||
        formData.electedRepInfo?.position === 'WARD_MEMBER') &&
      !formData.location?.wardNumber
    ) {
      errors.push('Ward is required');
    }
    return errors;
  }
);

export const selectStepTwoData = createSelector(selectFormData, (formData) => ({
  userType: formData.userType,
}));

export const selectUserType = createSelector(
  selectFormData,
  (formData) => formData.userType
);
