import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';
import { LanguageService } from './core/services/language.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Digital Profile Information System';
  private langSubscription: Subscription | null = null;

  constructor(
    private authFacade: AuthFacade,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.authFacade.initializeAuth();

    // Only handle language changes in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Subscribe to language changes WITHOUT calling setLanguage again
      // This prevents the circular subscription issue
      this.langSubscription = this.languageService.currentLanguage$.subscribe(
        (lang) => {
          if (lang && lang.code) {
            // Update the font directly instead of calling setLanguage again
            this.updateFontFamily(lang.code);
          }
        }
      );
    }
  }

  /**
   * Update font family directly based on language code
   */
  private updateFontFamily(langCode: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const fontFamily =
          langCode === 'ne'
            ? '"Noto Sans Devanagari", sans-serif'
            : '"IBM Plex Sans", sans-serif';

        document.documentElement.style.setProperty('font-family', fontFamily);
      } catch (e) {
        console.warn('Error updating font family:', e);
      }
    }
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
