import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';
import { LanguageService } from './core/services/language.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'Digital Profile Information System';

  constructor(
    private authFacade: AuthFacade,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    this.authFacade.initializeAuth();

    // Only handle language initialization in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Ensure the correct language class is applied on app initialization
      const currentLang = this.languageService.getCurrentLanguage();
      this.languageService.setLanguage(currentLang);
    }
  }
}
