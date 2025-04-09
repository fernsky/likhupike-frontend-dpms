import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { AddressResponse } from '../../../../types';

@Component({
  selector: 'app-citizen-address',
  templateUrl: './citizen-address.component.html',
  styleUrls: ['./citizen-address.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class CitizenAddressComponent {
  @Input() permanentAddress: AddressResponse | null | undefined;
  @Input() temporaryAddress: AddressResponse | null | undefined;
}
