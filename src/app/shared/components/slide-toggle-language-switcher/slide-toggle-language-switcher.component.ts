import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { BaseLanguageSwitcherComponent } from '../base-language-switcher/base-language-switcher.component';

@Component({
  selector: 'app-slide-toggle-language-switcher',
  templateUrl: './slide-toggle-language-switcher.component.html',
  styleUrls: ['./slide-toggle-language-switcher.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'languages',
      alias: 'languages',
    }),
    LanguageService, // Make sure LanguageService is provided here
  ],
})
export class SlideToggleLanguageSwitcherComponent extends BaseLanguageSwitcherComponent {
  constructor(
    languageService: LanguageService,
    translocoService: TranslocoService
  ) {
    super(languageService, translocoService);
  }
}
