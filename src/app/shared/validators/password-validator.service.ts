import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { PASSWORD_RULES } from '../../core/constants/validation.constants';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidatorService {
  private commonWords = [
    'password',
    'admin',
    'user',
    'login',
    '12345',
    'qwerty',
  ];
  private sequentialPatterns = [
    'abcdef',
    'qwerty',
    '123456',
    'abc123',
    // Add Nepali sequential patterns
    'कखगघ',
    '१२३४५',
  ];

  validatePassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    // Check minimum length
    if (value.length < PASSWORD_RULES.minLength) {
      errors['minLength'] = true;
    }

    // Check maximum length
    if (value.length > PASSWORD_RULES.maxLength) {
      errors['maxLength'] = true;
    }

    // Check for uppercase letters
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(value)) {
      errors['uppercase'] = true;
    }

    // Check for lowercase letters
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(value)) {
      errors['lowercase'] = true;
    }

    // Check for numbers
    if (PASSWORD_RULES.requireNumbers && !/[0-9]/.test(value)) {
      errors['number'] = true;
    }

    // Check for special characters
    if (
      PASSWORD_RULES.requireSpecialChars &&
      !new RegExp(`[${PASSWORD_RULES.allowedSpecialChars}]`).test(value)
    ) {
      errors['specialChar'] = true;
    }

    // Check for common words
    if (
      PASSWORD_RULES.preventCommonWords &&
      this.containsCommonWords(value.toLowerCase())
    ) {
      errors['commonWord'] = true;
    }

    // Check for sequential patterns
    if (
      PASSWORD_RULES.preventSequential &&
      this.containsSequentialPattern(value)
    ) {
      errors['sequential'] = true;
    }

    // Check for repeating characters
    if (PASSWORD_RULES.preventRepeating && /(.)\1{2,}/.test(value)) {
      errors['repeating'] = true;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  private containsCommonWords(password: string): boolean {
    return this.commonWords.some((word) => password.includes(word));
  }

  private containsSequentialPattern(password: string): boolean {
    return this.sequentialPatterns.some((pattern) =>
      password.toLowerCase().includes(pattern)
    );
  }

  calculateStrength(password: string): number {
    if (!password) return 0;

    let strength = 0;
    const checks = [
      password.length >= PASSWORD_RULES.minLength, // +20
      /[A-Z]/.test(password), // +20
      /[a-z]/.test(password), // +20
      /[0-9]/.test(password), // +20
      new RegExp(`[${PASSWORD_RULES.allowedSpecialChars}]`).test(password), // +20
      password.length >= 12, // +10
      !this.containsCommonWords(password), // +10
      !this.containsSequentialPattern(password), // +10
      !/(.)\1{2,}/.test(password), // +10
    ];

    checks.forEach((check, index) => {
      if (check) {
        strength += index < 5 ? 20 : 10;
      }
    });

    return Math.min(100, strength);
  }

  getPasswordErrorMessages(errors: ValidationErrors): string[] {
    if (!errors) return [];

    const messages: string[] = [];
    const errorMap = {
      minLength: 'Password must be at least 12 characters',
      maxLength: 'Password must be less than 128 characters',
      uppercase: 'Include at least one uppercase letter',
      lowercase: 'Include at least one lowercase letter',
      number: 'Include at least one number',
      specialChar: 'Include at least one special character',
      commonWord: 'Avoid common words or patterns',
      sequential: 'Avoid sequential patterns',
      repeating: 'Avoid repeating characters',
    };

    Object.keys(errors).forEach((key) => {
      if (errorMap[key as keyof typeof errorMap]) {
        messages.push(errorMap[key as keyof typeof errorMap]);
      }
    });

    return messages;
  }

  passwordMatchValidator(passwordKey: string, confirmPasswordKey: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control) return null;

      const form = control as FormGroup;
      const password = form.get(passwordKey)?.value;
      const confirmPassword = form.get(confirmPasswordKey)?.value;

      if (password !== confirmPassword) {
        form.get(confirmPasswordKey)?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      form.get(confirmPasswordKey)?.setErrors(null);
      return null;
    };
  }
}
