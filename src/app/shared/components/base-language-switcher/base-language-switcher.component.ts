import { Component } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language.service';
import { Observable } from 'rxjs';

export interface Language {
  code: string;
  icon: string;
  name: string;
  localName: string;
}

@Component({
  template: '',
})
export abstract class BaseLanguageSwitcherComponent {
  protected currentLanguage$: Observable<Language>;
  protected languages: Language[];

  constructor(
    protected languageService: LanguageService,
    protected translocoService: TranslocoService
  ) {
    this.currentLanguage$ = this.languageService.currentLanguage$;
    this.languages = this.languageService.availableLanguages;
  }

  protected switchLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  protected getLocalizedName(lang: Language): string {
    return this.translocoService.translate(`languages.${lang.code}.name`);
  }

  protected getLocalizedLocalName(lang: Language): string {
    return this.translocoService.translate(`languages.${lang.code}.localName`);
  }

  protected getDisplayLanguageCode(lang: Language): string {
    return lang.code === 'en' ? 'नेपाली' : 'English';
  }
}
