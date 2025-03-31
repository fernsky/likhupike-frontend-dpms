import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { LanguageService } from '../../../core/services/language.service';
import { BaseLanguageSwitcherComponent } from '../base-language-switcher/base-language-switcher.component';
import { DropdownModule } from 'carbon-components-angular';
import { RouterModule } from '@angular/router';

interface LanguageListItem {
  content: string;
  value: string;
  selected: boolean;
  disabled: boolean;
  hidden?: boolean;
}

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoModule, DropdownModule, RouterModule],
  providers: [
    provideTranslocoScope({
      scope: 'languages',
      alias: 'languages',
    }),
    LanguageService,
  ],
})
export class LanguageDropdownComponent
  extends BaseLanguageSwitcherComponent
  implements OnInit
{
  @HostBinding('class.header-language-dropdown') isHeaderDropdown = true;

  languageItems: LanguageListItem[] = [];

  constructor(
    protected override languageService: LanguageService,
    protected override translocoService: TranslocoService
  ) {
    super(languageService, translocoService);
  }

  ngOnInit(): void {
    this.initLanguageItems();

    // Update items whenever the current language changes
    this.currentLanguage$.subscribe((lang) => {
      this.updateSelectedItem(lang.code);
    });
  }

  /**
   * Initialize dropdown items from available languages
   */
  private initLanguageItems(): void {
    this.languageItems = this.languages.map((lang) => ({
      content: lang.localName,
      value: lang.code,
      selected: this.languageService.getCurrentLanguage().code === lang.code,
      disabled: false,
      hidden: false,
    }));
  }

  /**
   * Update the selected state of items when language changes
   */
  private updateSelectedItem(langCode: string): void {
    this.languageItems = this.languageItems.map((item) => ({
      ...item,
      selected: item.value === langCode,
    }));
  }

  /**
   * Handle language selection from dropdown
   * @param event Selection event from Carbon dropdown component
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLanguageSelected(event: any): void {
    if (event?.item?.value) {
      const selectedLang = this.languages.find(
        (lang) => lang.code === event.item.value
      );

      if (selectedLang) {
        this.switchLanguage(selectedLang);
      }
    }
  }
}
