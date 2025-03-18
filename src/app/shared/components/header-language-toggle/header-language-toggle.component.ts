import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language.service';
import { TranslocoModule } from '@jsverse/transloco';
import { BaseLanguageSwitcherComponent } from '../base-language-switcher/base-language-switcher.component';

@Component({
  selector: 'app-header-language-toggle',
  templateUrl: './header-language-toggle.component.html',
  styleUrls: ['./header-language-toggle.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslocoModule,
  ],
})
export class HeaderLanguageToggleComponent extends BaseLanguageSwitcherComponent {
  constructor(
    languageService: LanguageService,
    translocoService: TranslocoService
  ) {
    super(languageService, translocoService);
  }
}
