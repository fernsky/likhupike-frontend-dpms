import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cooperative-search',
  templateUrl: './cooperative-search.component.html',
  styleUrls: ['./cooperative-search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class CooperativeSearchComponent implements OnInit, OnDestroy {
  @Input() initialSearchTerm: string | null = null;
  @Output() searchTerm = new EventEmitter<string>();
  @Output() resetSearch = new EventEmitter<void>();

  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
  });

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Initialize search form with any provided initial value
    if (this.initialSearchTerm) {
      this.searchForm.get('searchTerm')?.setValue(this.initialSearchTerm);
    }

    // Set up auto-search with debounce
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term) => {
        if (term && term.trim().length > 2) {
          this.searchTerm.emit(term);
        } else if (!term) {
          this.onResetSearch();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    const term = this.searchForm.get('searchTerm')?.value;
    if (term) {
      this.searchTerm.emit(term);
    }
  }

  onResetSearch(): void {
    this.searchForm.get('searchTerm')?.setValue('');
    this.resetSearch.emit();
  }
}
