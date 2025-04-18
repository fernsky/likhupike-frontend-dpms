import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  TranslocoModule,
  provideTranslocoScope,
  TranslocoService,
} from '@jsverse/transloco';

import {
  CooperativeResponse,
  CooperativeTranslationResponse,
  ContentStatus,
  CreateCooperativeTranslationDto,
} from '../../types';
import { CooperativeTranslationActions } from '../../store/actions';
import * as fromCooperatives from '../../store/selectors';
import { TranslationEditorDialogComponent } from '../dialogs/translation-editor-dialog/translation-editor-dialog.component';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cooperative-translations',
  templateUrl: './cooperative-translations.component.html',
  styleUrls: ['./cooperative-translations.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class CooperativeTranslationsComponent implements OnInit, OnChanges {
  @Input() cooperative!: CooperativeResponse;

  translations$: Observable<CooperativeTranslationResponse[]>;
  loading$: Observable<boolean>;

  availableLocales = ['en', 'ne']; // This could be fetched from a config service
  contentStatuses = Object.values(ContentStatus);

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) {
    this.translations$ = this.store.select(
      fromCooperatives.selectAllTranslations
    );
    this.loading$ = this.store.select(
      fromCooperatives.selectTranslationsLoading
    );
  }

  ngOnInit(): void {
    if (this.cooperative) {
      this.loadTranslations();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperative'] && this.cooperative) {
      this.loadTranslations();
    }
  }

  loadTranslations(): void {
    this.store.dispatch(
      CooperativeTranslationActions.loadTranslations({
        cooperativeId: this.cooperative.id,
      })
    );

    // Replace the general translations observable with one filtered for this cooperative
    this.translations$ = this.store.select(
      fromCooperatives.selectCooperativeTranslations(this.cooperative.id)
    );
  }

  getAvailableLocales(): string[] {
    // Filter out locales that already have translations
    return this.cooperative.translations
      ? this.availableLocales.filter(
          (locale) =>
            !this.cooperative.translations.some((t) => t.locale === locale)
        )
      : this.availableLocales;
  }

  openCreateTranslationDialog(): void {
    if (this.getAvailableLocales().length === 0) {
      return; // All locales already have translations
    }

    const dialogRef = this.dialog.open(TranslationEditorDialogComponent, {
      width: '800px',
      data: {
        cooperative: this.cooperative,
        availableLocales: this.getAvailableLocales(),
        isNew: true,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: CreateCooperativeTranslationDto) => {
        if (result) {
          this.store.dispatch(
            CooperativeTranslationActions.createTranslation({
              cooperativeId: this.cooperative.id,
              translation: result,
            })
          );
        }
      });
  }

  openEditTranslationDialog(translation: CooperativeTranslationResponse): void {
    const dialogRef = this.dialog.open(TranslationEditorDialogComponent, {
      width: '800px',
      data: {
        cooperative: this.cooperative,
        translation: translation,
        isNew: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          CooperativeTranslationActions.updateTranslation({
            cooperativeId: this.cooperative.id,
            translationId: translation.id,
            translation: result,
          })
        );
      }
    });
  }

  confirmDeleteTranslation(translation: CooperativeTranslationResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate(
          'cooperative.dialogs.deleteTranslationTitle'
        ),
        message: this.transloco.translate(
          'cooperative.dialogs.deleteTranslationMessage',
          {
            locale: this.getLocaleName(translation.locale),
          }
        ),
        confirmButton: this.transloco.translate('common.actions.delete'),
        cancelButton: this.transloco.translate('common.actions.cancel'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(
          CooperativeTranslationActions.deleteTranslation({
            cooperativeId: this.cooperative.id,
            translationId: translation.id,
          })
        );
      }
    });
  }

  updateTranslationStatus(
    translation: CooperativeTranslationResponse,
    status: ContentStatus
  ): void {
    this.store.dispatch(
      CooperativeTranslationActions.updateTranslationStatus({
        cooperativeId: this.cooperative.id,
        translationId: translation.id,
        status: status,
      })
    );
  }

  getLocaleName(localeCode: string): string {
    switch (localeCode) {
      case 'en':
        return 'English';
      case 'ne':
        return 'Nepali';
      default:
        return localeCode;
    }
  }

  getStatusColor(status: ContentStatus): string {
    switch (status) {
      case ContentStatus.PUBLISHED:
        return 'primary';
      case ContentStatus.DRAFT:
        return 'warn';
      case ContentStatus.PENDING_REVIEW:
        return 'accent';
      case ContentStatus.ARCHIVED:
        return '';
      default:
        return '';
    }
  }
}
