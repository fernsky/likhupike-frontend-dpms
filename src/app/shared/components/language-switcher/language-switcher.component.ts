import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { BaseLanguageSwitcherComponent } from '../base-language-switcher/base-language-switcher.component';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'languages',
      alias: 'languages',
    }),
  ],
})
export class LanguageSwitcherComponent extends BaseLanguageSwitcherComponent {
  constructor(
    languageService: LanguageService,
    translocoService: TranslocoService
  ) {
    super(languageService, translocoService);
  }
}
