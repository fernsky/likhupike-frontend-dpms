import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  private isBrowser: boolean;

  readonly availableLanguages: Language[] = AVAILABLE_LANGUAGES;

  private currentLanguageSubject = new BehaviorSubject<Language>(
    this.availableLanguages[0]
  );
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private translocoService: TranslocoService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Default to first language
    let selectedLang = this.availableLanguages[0];

    if (this.isBrowser) {
      try {
        const savedLang = localStorage.getItem(this.LANGUAGE_KEY);
        if (savedLang) {
          const found = this.availableLanguages.find(
            (l) => l.code === savedLang
          );
          if (found) {
            selectedLang = found;
          }
        }
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }

    this.setLanguage(selectedLang);
  }

  setLanguage(language: Language): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.LANGUAGE_KEY, language.code);
      } catch (e) {
        console.warn('LocalStorage not available:', e);
      }
    }

    this.currentLanguageSubject.next(language);
    this.translocoService.setActiveLang(language.code);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }
}
