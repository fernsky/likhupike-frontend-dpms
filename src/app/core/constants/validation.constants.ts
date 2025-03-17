export const PASSWORD_PATTERN =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const PASSWORD_RULES = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  allowedSpecialChars: '!@#$%^&*(),.?":{}|<>',
  preventCommonWords: true,
  preventSequential: true,
  preventRepeating: true,
};

export const EMAIL_RULES = {
  governmentDomains: [
    'nepal.gov.np',
    'moha.gov.np',
    // Add other government domains here
  ],
};

export const PASSWORD_VALIDATION_MESSAGES = {
  minLength: 'Password must be at least 8 characters',
  maxLength: 'Password cannot exceed 128 characters',
  uppercase: 'Must contain at least one uppercase letter',
  lowercase: 'Must contain at least one lowercase letter',
  number: 'Must contain at least one number',
  specialChar: 'Must contain at least one special character (!@#$%^&*)',
  commonWord: 'Password cannot contain common words',
  sequential: 'Password cannot contain sequential characters',
  repeating: 'Password cannot contain repeating characters',
  mismatch: 'Passwords do not match',
};

export const PASSWORD_STRENGTH_LEVELS = {
  VERY_WEAK: {
    threshold: 20,
    color: 'var(--error-color)',
    label: 'Very Weak',
  },
  WEAK: {
    threshold: 40,
    color: '#ef4444',
    label: 'Weak',
  },
  MEDIUM: {
    threshold: 60,
    color: '#eab308',
    label: 'Medium',
  },
  STRONG: {
    threshold: 80,
    color: '#22c55e',
    label: 'Strong',
  },
  VERY_STRONG: {
    threshold: 100,
    color: 'var(--success-color)',
    label: 'Very Strong',
  },
};

export const VALIDATION_MESSAGES = {
  email: {
    required: 'Email address cannot be empty',
    email: 'The provided email address is invalid',
  },
  password: {
    required: 'Password cannot be empty',
    pattern: `Password must contain:
      - At least 8 characters
      - At least one uppercase letter
      - At least one lowercase letter
      - At least one number
      - At least one special character (@#$%^&+=)`,
  },
  fullName: {
    required: 'Full name cannot be empty',
    minlength: 'Full name must be at least 2 characters',
    maxlength: 'Full name cannot exceed 100 characters',
  },
  fullNameNepali: {
    required: 'Nepali name cannot be empty',
    nepaliName: 'Please enter a valid name in Nepali',
  },
  dateOfBirth: {
    required: 'Date of birth is required',
    past: 'Date of birth must be a past date',
  },
  address: {
    required: 'Address cannot be empty',
    minlength: 'Address must be at least 5 characters',
    maxlength: 'Address cannot exceed 200 characters',
  },
  wardNumber: {
    min: 'Ward number must be at least 1',
    max: 'Ward number cannot exceed 5',
  },
};
