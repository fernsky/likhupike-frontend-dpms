import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { LanguageDropdownComponent } from '../language-dropdown/language-dropdown.component';

@Component({
  selector: 'app-gov-branding',
  templateUrl: './gov-branding.component.html',
  styleUrls: ['./gov-branding.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LanguageDropdownComponent,
    TranslocoPipe,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'government-branding',
      alias: 'govBranding',
    }),
  ],
})
export class GovBrandingComponent {
  @Input() elevated: boolean = false;
}
