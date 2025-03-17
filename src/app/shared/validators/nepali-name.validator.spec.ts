import { FormControl } from '@angular/forms';
import { nepaliNameValidator } from './nepali-name.validator';

describe('NepaliNameValidator', () => {
  const validator = nepaliNameValidator();

  // Valid test cases
  const validNames = [
    'राम बहादुर',
    'सीता कुमारी थापा',
    'कृष्ण प्रसाद आचार्य',
    'दुर्गा देवी पौडेल',
    'हरि माया तामाङ',
  ];

  validNames.forEach((name) => {
    it(`should accept valid Nepali name: ${name}`, () => {
      const control = new FormControl(name);
      const result = validator(control);
      expect(result).toBeNull();
    });
  });

  // Length validation
  it('should reject names shorter than minimum length', () => {
    const control = new FormControl('राम');
    const result = validator(control);
    expect(result?.['nepaliName'].message).toContain(
      'नाम 4 देखि 50 अक्षरको हुनुपर्छ',
    );
  });

  it('should reject names longer than maximum length', () => {
    const longName = 'राम '.repeat(20);
    const control = new FormControl(longName);
    const result = validator(control);
    expect(result?.['nepaliName'].message).toContain(
      'नाम 4 देखि 50 अक्षरको हुनुपर्छ',
    );
  });

  // Character validation
  it('should reject names with non-Nepali characters', () => {
    const invalidInputs = [
      'Ram बहादुर',
      'सीता Kumar',
      'कृष्ण123',
      'दुर्गा@देवी',
      'हरि!माया',
    ];

    invalidInputs.forEach((name) => {
      const control = new FormControl(name);
      const result = validator(control);
      expect(result?.['nepaliName'].message).toBe(
        'कृपया नेपाली अक्षरहरू मात्र प्रयोग गर्नुहोस्',
      );
    });
  });

  // Space validation
  it('should reject names with multiple consecutive spaces', () => {
    const control = new FormControl('राम  बहादुर');
    const result = validator(control);
    expect(result?.['nepaliName'].message).toBe(
      'लगातार खाली स्थान (space) प्रयोग नगर्नुहोस्',
    );
  });

  it('should reject names with leading or trailing spaces', () => {
    const spaceCases = [' राम बहादुर', 'राम बहादुर ', ' राम बहादुर '];

    spaceCases.forEach((name) => {
      const control = new FormControl(name);
      const result = validator(control);
      expect(result?.['nepaliName'].message).toBe(
        'नाम सुरु वा अन्त्यमा खाली स्थान (space) नराख्नुहोस्',
      );
    });
  });

  // Word count validation
  it('should reject single word names', () => {
    const control = new FormControl('रामबहादुर');
    const result = validator(control);
    expect(result?.['nepaliName'].message).toBe(
      'कृपया पूरा नाम लेख्नुहोस् (पहिलो र थर)',
    );
  });

  // Honorific validation
  it('should reject names with honorifics', () => {
    const honorificCases = [
      'श्री राम बहादुर',
      'श्रीमती सीता कुमारी',
      'सुश्री दुर्गा देवी',
      'श्रीमान हरि बहादुर',
    ];

    honorificCases.forEach((name) => {
      const control = new FormControl(name);
      const result = validator(control);
      expect(result?.['nepaliName'].message).toBe(
        'कृपया सम्बोधन शब्दहरू (श्री, श्रीमान, आदि) नराख्नुहोस्',
      );
    });
  });

  // Edge cases
  it('should handle null and empty values', () => {
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('should handle undefined values', () => {
    expect(validator(new FormControl(undefined))).toBeNull();
  });

  // Unicode range tests
  it('should accept all valid Devanagari Unicode ranges', () => {
    // Test various Devanagari characters across the valid ranges
    const complexName = 'ऋषिराज ज्ञवाली';
    const control = new FormControl(complexName);
    expect(validator(control)).toBeNull();
  });
});
