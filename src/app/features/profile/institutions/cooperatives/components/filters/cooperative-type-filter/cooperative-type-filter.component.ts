import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CooperativeType } from '../../../types';
import { SearchMethod } from '../../../store/state';
import * as fromCooperatives from '../../../store/selectors';

@Component({
  selector: 'app-cooperative-type-filter',
  templateUrl: './cooperative-type-filter.component.html',
  styleUrls: ['./cooperative-type-filter.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatRippleModule,
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
export class CooperativeTypeFilterComponent implements OnInit {
  @Input() activeSearchMethod: SearchMethod | null = SearchMethod.None;
  @Output() filterChange = new EventEmitter<CooperativeType>();

  cooperativeTypes = Object.values(CooperativeType);
  typeStatistics$: Observable<{ [key in CooperativeType]?: number }>;
  selectedType: CooperativeType | null = null;
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private store: Store) {
    this.typeStatistics$ = this.store.select(
      fromCooperatives.selectStatisticsByType
    );
  }

  ngOnInit(): void {
    // Initialize the selected type or perform any setup logic if needed
    this.selectedType = null;
  }

  onFilterByType(type: CooperativeType): void {
    if (this.selectedType === type) {
      this.selectedType = null;
      // Reset filter
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.filterChange.emit(null as any);
    } else {
      this.selectedType = type;
      this.filterChange.emit(type);
    }
  }

  isSelected(type: CooperativeType): boolean {
    return (
      this.selectedType === type ||
      (this.activeSearchMethod === SearchMethod.ByType &&
        this.selectedType === type)
    );
  }

  getTypeCount(type: CooperativeType): Observable<number> {
    return this.store.select(fromCooperatives.selectStatisticsForType(type));
  }

  getTypeIcon(type: CooperativeType): string {
    switch (type) {
      case CooperativeType.AGRICULTURE:
        return 'grass';
      case CooperativeType.ANIMAL_HUSBANDRY:
        return 'pets';
      case CooperativeType.DAIRY:
        return 'water_drop';
      case CooperativeType.SAVINGS_AND_CREDIT:
        return 'account_balance';
      case CooperativeType.MULTIPURPOSE:
        return 'category';
      case CooperativeType.CONSUMER:
        return 'shopping_cart';
      case CooperativeType.COFFEE:
      case CooperativeType.TEA:
        return 'local_cafe';
      case CooperativeType.HANDICRAFT:
        return 'handyman';
      case CooperativeType.FRUITS_AND_VEGETABLES:
        return 'eco';
      case CooperativeType.BEE_KEEPING:
        return 'emoji_nature';
      case CooperativeType.HEALTH:
        return 'local_hospital';
      case CooperativeType.ELECTRICITY:
      case CooperativeType.ENERGY:
        return 'bolt';
      case CooperativeType.COMMUNICATION:
        return 'chat';
      case CooperativeType.TOURISM:
        return 'luggage';
      case CooperativeType.ENVIRONMENT_CONSERVATION:
        return 'park';
      case CooperativeType.TRANSPORTATION:
        return 'directions_bus';
      case CooperativeType.SMALL_FARMERS:
        return 'agriculture';
      case CooperativeType.WOMEN:
        return 'person';
      default:
        return 'business';
    }
  }
}
