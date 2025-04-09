import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CitizenResponse } from '../../../../types';

@Component({
  selector: 'app-citizen-info',
  templateUrl: './citizen-info.component.html',
  styleUrls: ['./citizen-info.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class CitizenInfoComponent {
  @Input() citizen!: CitizenResponse;

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }
}
