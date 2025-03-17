import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  Language,
  LanguageService,
} from '../../../core/services/language.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

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
    TranslocoPipe,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'languages',
      alias: 'languages',
    }),
  ],
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage: Language;
  languages: Language[];

  constructor(
    private languageService: LanguageService,
    private translocoService: TranslocoService
  ) {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languages = this.languageService.availableLanguages;
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(
      (language) => (this.currentLanguage = language)
    );
  }

  switchLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  getLocalizedName(lang: Language): string {
    return this.translocoService.translate(`languages.${lang.code}.name`);
  }

  getLocalizedLocalName(lang: Language): string {
    return this.translocoService.translate(`languages.${lang.code}.localName`);
  }
}
