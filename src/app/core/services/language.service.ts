import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  icon: string;
  name: string;
  localName: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: 'en',
    icon: 'language',
    name: 'English',
    localName: 'English',
  },
  {
    code: 'ne',
    icon: 'translate',
    name: 'Nepali',
    localName: 'नेपाली',
  },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'selected_language';

  readonly availableLanguages: Language[] = AVAILABLE_LANGUAGES;

  private currentLanguageSubject = new BehaviorSubject<Language>(
    this.availableLanguages[0]
  );
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translocoService: TranslocoService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLang = localStorage.getItem(this.LANGUAGE_KEY);
    const defaultLang = savedLang
      ? this.availableLanguages.find((l) => l.code === savedLang)
      : this.availableLanguages[0];
    if (defaultLang) {
      this.setLanguage(defaultLang);
    }
  }

  setLanguage(language: Language): void {
    localStorage.setItem(this.LANGUAGE_KEY, language.code);
    this.currentLanguageSubject.next(language);
    this.translocoService.setActiveLang(language.code);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }
}
