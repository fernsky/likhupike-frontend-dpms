import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nepaliPhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Nepali phone number validation rules:
    // 1. Must be exactly 10 digits
    // 2. Must start with 9
    const phoneRegex = /^9[0-9]{9}$/;

    return phoneRegex.test(value)
      ? null
      : { nepaliPhone: { valid: false, value: value } };
  };
}
