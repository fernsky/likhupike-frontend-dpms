import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'nepaliNumber',
  standalone: true,
})
export class NepaliNumberPipe implements PipeTransform {
  private static readonly NEPALI_DIGITS = [
    '०',
    '१',
    '२',
    '३',
    '४',
    '५',
    '६',
    '७',
    '८',
    '९',
  ];

  constructor(private translocoService: TranslocoService) {}

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const currentLang = this.translocoService.getActiveLang();
    if (currentLang !== 'ne') {
      return value.toString();
    }

    return value
      .toString()
      .split('')
      .map((char) => {
        const digit = parseInt(char, 10);
        return isNaN(digit) ? char : NepaliNumberPipe.NEPALI_DIGITS[digit];
      })
      .join('');
  }
}
