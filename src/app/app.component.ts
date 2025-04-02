import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';
import { LanguageService } from './core/services/language.service';

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
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.authFacade.initializeAuth();

    // Ensure the correct language class is applied on app initialization
    const currentLang = this.languageService.getCurrentLanguage();
    this.languageService.setLanguage(currentLang);
  }
}
