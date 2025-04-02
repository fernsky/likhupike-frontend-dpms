import {
  Injectable,
  Renderer2,
  RendererFactory2,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

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
  private renderer: Renderer2;
  private isBrowser: boolean;

  readonly availableLanguages: Language[] = AVAILABLE_LANGUAGES;

  private currentLanguageSubject = new BehaviorSubject<Language>(
    this.availableLanguages[0]
  );
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private translocoService: TranslocoService,
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeLanguage();
  }

  /**
   * Safely get an item from localStorage with fallback for SSR
   */
  private getLocalStorageItem(key: string): string | null {
    if (this.isBrowser) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('Error accessing localStorage:', e);
      }
    }
    return null;
  }

  /**
   * Safely set an item in localStorage with fallback for SSR
   */
  private setLocalStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('Error setting localStorage:', e);
      }
    }
  }

  private initializeLanguage(): void {
    // Use the safe localStorage wrapper method
    const savedLang = this.getLocalStorageItem(this.LANGUAGE_KEY);

    // Default to first language (English) if no saved language or not in browser
    const defaultLang = savedLang
      ? this.availableLanguages.find((l) => l.code === savedLang)
      : this.availableLanguages[0];

    if (defaultLang) {
      this.setLanguage(defaultLang);
    } else {
      // Extra safety - always fallback to first language if something went wrong
      this.setLanguage(this.availableLanguages[0]);
    }
  }

  setLanguage(language: Language): void {
    // Use safe localStorage wrapper
    this.setLocalStorageItem(this.LANGUAGE_KEY, language.code);

    this.currentLanguageSubject.next(language);
    this.translocoService.setActiveLang(language.code);

    // Only manipulate the DOM if we're in a browser environment
    if (this.isBrowser) {
      // Apply language-specific class to the html element for font switching
      const html = document.documentElement;

      // Remove any existing language classes
      this.availableLanguages.forEach((lang) => {
        this.renderer.removeClass(html, `lang-${lang.code}`);
      });

      // Add the current language class
      this.renderer.addClass(html, `lang-${language.code}`);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }
}
