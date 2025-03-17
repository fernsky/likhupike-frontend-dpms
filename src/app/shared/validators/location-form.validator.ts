import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserType } from '@app/core/models/user-type.enum';
import { ElectedPosition } from '@app/core/models/office.enum';

export function locationFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const userType = control.get('userType')?.value;
    const position = control.get('position')?.value;
    const provinceCode = control.get('provinceCode')?.value;
    const districtCode = control.get('districtCode')?.value;
    const municipalityCode = control.get('municipalityCode')?.value;
    const wardNumber = control.get('wardNumber')?.value;
    const isWardOffice = control.get('isWardOffice')?.value;

    if (!provinceCode || !districtCode || !municipalityCode) {
      return { locationRequired: true };
    }

    // Ward number is required for citizens, ward-level positions, and ward office employees
    if (
      userType === UserType.CITIZEN ||
      position === ElectedPosition.WARD_CHAIRPERSON ||
      position === ElectedPosition.WARD_MEMBER ||
      isWardOffice
    ) {
      if (!wardNumber) {
        return { wardRequired: true };
      }
    }

    return null;
  };
}
