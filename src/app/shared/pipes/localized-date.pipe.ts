import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localizedDate',
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  private readonly nepaliMonths = [
    'बैशाख',
    'जेठ',
    'असार',
    'श्रावण',
    'भदौ',
    'आश्विन',
    'कार्तिक',
    'मंसिर',
    'पुष',
    'माघ',
    'फाल्गुन',
    'चैत्र',
  ];

  private readonly nepaliDays = [
    'आइतबार',
    'सोमबार',
    'मंगलबार',
    'बुधबार',
    'बिहिबार',
    'शुक्रबार',
    'शनिबार',
  ];

  constructor(private datePipe: DatePipe) {}

  transform(value: any, format: string = 'mediumDate'): string {
    if (!value) return '';

    const currentLang = 'ne';

    if (currentLang === 'ne') {
      const date = new Date(value);

      switch (format) {
        case 'fullDate':
          return this.toNepaliFullDate(date);
        case 'mediumDate':
          return this.toNepaliMediumDate(date);
        case 'shortDate':
          return this.toNepaliShortDate(date);
        default:
          return this.datePipe.transform(value, format, 'ne-NP') || '';
      }
    }

    return this.datePipe.transform(value, format, 'en-US') || '';
  }

  private toNepaliFullDate(date: Date): string {
    const day = this.nepaliDays[date.getDay()];
    const month = this.nepaliMonths[date.getMonth()];
    const year = this.toNepaliNumerals(date.getFullYear());
    const dayOfMonth = this.toNepaliNumerals(date.getDate());

    return `${day}, ${month} ${dayOfMonth}, ${year}`;
  }

  private toNepaliMediumDate(date: Date): string {
    const month = this.nepaliMonths[date.getMonth()];
    const year = this.toNepaliNumerals(date.getFullYear());
    const dayOfMonth = this.toNepaliNumerals(date.getDate());

    return `${month} ${dayOfMonth}, ${year}`;
  }

  private toNepaliShortDate(date: Date): string {
    const month = this.toNepaliNumerals(date.getMonth() + 1);
    const year = this.toNepaliNumerals(date.getFullYear());
    const dayOfMonth = this.toNepaliNumerals(date.getDate());

    return `${year}/${month}/${dayOfMonth}`;
  }

  private toNepaliNumerals(num: number): string {
    const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num
      .toString()
      .split('')
      .map((char) => nepaliNumerals[parseInt(char)] || char)
      .join('');
  }
}
