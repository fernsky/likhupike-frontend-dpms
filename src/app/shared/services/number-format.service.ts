import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class NumberFormatService {
  private nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

  constructor(private translocoService: TranslocoService) {}

  formatNumber(num: number): string {
    if (this.translocoService.getActiveLang() === 'ne') {
      return String(num)
        .split('')
        .map((digit) =>
          /^\d$/.test(digit) ? this.nepaliDigits[parseInt(digit)] : digit
        )
        .join('');
    }
    return String(num);
  }
}
