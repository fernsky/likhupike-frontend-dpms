import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { CooperativeType } from '../../../types';

@Component({
  selector: 'app-type-badge',
  templateUrl: './type-badge.component.html',
  styleUrls: ['./type-badge.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, TranslocoModule],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class TypeBadgeComponent implements OnInit, OnChanges {
  @Input() type: CooperativeType | null = null;
  @Input() showText = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  typeIcon = '';
  typeColor = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.updateTypeIcon();
  }

  ngOnChanges(): void {
    this.updateTypeIcon();
  }

  private updateTypeIcon(): void {
    if (!this.type) {
      this.typeIcon = 'help_outline';
      this.typeColor = '#9e9e9e'; // Default gray
      return;
    }

    // Assign specific icons based on cooperative type
    switch (this.type) {
      case CooperativeType.AGRICULTURE:
        this.typeIcon = 'grass';
        this.typeColor = '#4caf50'; // Green
        break;
      case CooperativeType.ANIMAL_HUSBANDRY:
        this.typeIcon = 'pets';
        this.typeColor = '#8d6e63'; // Brown
        break;
      case CooperativeType.DAIRY:
        this.typeIcon = 'water_drop';
        this.typeColor = '#42a5f5'; // Light blue
        break;
      case CooperativeType.SAVINGS_AND_CREDIT:
        this.typeIcon = 'account_balance';
        this.typeColor = '#5c6bc0'; // Indigo
        break;
      case CooperativeType.MULTIPURPOSE:
        this.typeIcon = 'category';
        this.typeColor = '#7e57c2'; // Deep purple
        break;
      case CooperativeType.CONSUMER:
        this.typeIcon = 'shopping_cart';
        this.typeColor = '#26a69a'; // Teal
        break;
      case CooperativeType.COFFEE:
      case CooperativeType.TEA:
        this.typeIcon = 'local_cafe';
        this.typeColor = '#795548'; // Brown
        break;
      case CooperativeType.HANDICRAFT:
        this.typeIcon = 'handyman';
        this.typeColor = '#ff7043'; // Deep orange
        break;
      case CooperativeType.FRUITS_AND_VEGETABLES:
        this.typeIcon = 'eco';
        this.typeColor = '#66bb6a'; // Light green
        break;
      case CooperativeType.BEE_KEEPING:
        this.typeIcon = 'emoji_nature';
        this.typeColor = '#ffa726'; // Orange
        break;
      case CooperativeType.HEALTH:
        this.typeIcon = 'local_hospital';
        this.typeColor = '#ef5350'; // Red
        break;
      case CooperativeType.ELECTRICITY:
      case CooperativeType.ENERGY:
        this.typeIcon = 'bolt';
        this.typeColor = '#ffca28'; // Amber
        break;
      case CooperativeType.COMMUNICATION:
        this.typeIcon = 'chat';
        this.typeColor = '#29b6f6'; // Light blue
        break;
      case CooperativeType.TOURISM:
        this.typeIcon = 'luggage';
        this.typeColor = '#26c6da'; // Cyan
        break;
      case CooperativeType.ENVIRONMENT_CONSERVATION:
        this.typeIcon = 'park';
        this.typeColor = '#9ccc65'; // Light green
        break;
      case CooperativeType.TRANSPORTATION:
        this.typeIcon = 'directions_bus';
        this.typeColor = '#78909c'; // Blue gray
        break;
      case CooperativeType.SMALL_FARMERS:
        this.typeIcon = 'agriculture';
        this.typeColor = '#8bc34a'; // Light green
        break;
      case CooperativeType.WOMEN:
        this.typeIcon = 'person';
        this.typeColor = '#ec407a'; // Pink
        break;
      default:
        this.typeIcon = 'business';
        this.typeColor = '#3f51b5'; // Indigo (default)
    }
  }

  getTypeTranslation(): string {
    if (!this.type) {
      return 'cooperative.types.unknown';
    }
    return `cooperative.types.${this.type.toLowerCase()}`;
  }

  getTypeDescription(): string {
    if (!this.type) {
      return 'cooperative.types.unknown.description';
    }
    return `cooperative.types.${this.type.toLowerCase()}.description`;
  }
}
