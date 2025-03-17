import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nepaliNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Nepali Unicode ranges
    const nepaliUnicodeRanges = [
      // Devanagari Basic Characters
      [0x0900, 0x097f], // Basic Devanagari
      // Devanagari Extended
      [0xa8e0, 0xa8ff], // Devanagari Extended
      // Common Nepali symbols
      [0x0964, 0x096f], // Danda and Nepali digits
    ];

    // Minimum and maximum name length in characters
    const MIN_LENGTH = 4; // Minimum characters for a full name
    const MAX_LENGTH = 50; // Maximum characters allowed

    // Check length
    if (value.length < MIN_LENGTH || value.length > MAX_LENGTH) {
      return {
        nepaliName: {
          message: `नाम ${MIN_LENGTH} देखि ${MAX_LENGTH} अक्षरको हुनुपर्छ`,
        },
      };
    }

    // Check if string contains only Nepali characters and spaces
    const isValidNepaliChar = (char: string): boolean => {
      const code = char.charCodeAt(0);
      return (
        char === ' ' || // Allow spaces
        nepaliUnicodeRanges.some(([start, end]) => code >= start && code <= end)
      );
    };

    if (![...value].every(isValidNepaliChar)) {
      return {
        nepaliName: {
          message: 'कृपया नेपाली अक्षरहरू मात्र प्रयोग गर्नुहोस्',
        },
      };
    }

    // Check for multiple consecutive spaces
    if (/\s\s/.test(value)) {
      return {
        nepaliName: {
          message: 'लगातार खाली स्थान (space) प्रयोग नगर्नुहोस्',
        },
      };
    }

    // Check if starts or ends with space
    if (value.startsWith(' ') || value.endsWith(' ')) {
      return {
        nepaliName: {
          message: 'नाम सुरु वा अन्त्यमा खाली स्थान (space) नराख्नुहोस्',
        },
      };
    }

    // Check for minimum word count (at least two words for full name)
    const wordCount = value.trim().split(/\s+/).length;
    if (wordCount < 2) {
      return {
        nepaliName: {
          message: 'कृपया पूरा नाम लेख्नुहोस् (पहिलो र थर)',
        },
      };
    }

    // Check for common Nepali honorifics that shouldn't be part of the name
    const invalidHonorifics = ['श्री', 'श्रीमान', 'श्रीमती', 'सुश्री'];
    if (invalidHonorifics.some((honorific) => value.includes(honorific))) {
      return {
        nepaliName: {
          message: 'कृपया सम्बोधन शब्दहरू (श्री, श्रीमान, आदि) नराख्नुहोस्',
        },
      };
    }

    return null;
  };
}
