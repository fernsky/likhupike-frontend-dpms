import { Component, Input, OnInit } from '@angular/core';
import { CooperativeType } from '../../../types';
import { Store } from '@ngrx/store';
import * as fromCooperatives from '../../../store/selectors';

@Component({
  selector: 'app-type-badge',
  templateUrl: './type-badge.component.html',
  styleUrls: ['./type-badge.component.scss']
})
export class TypeBadgeComponent implements OnInit {
  @Input() type: CooperativeType | null = null;
  
  typeIcon = '';

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
      return;
    }

    // Assign specific icons based on cooperative type
    switch (this.type) {
      case CooperativeType.AGRICULTURE:
        this.typeIcon = 'grass';
        break;
      case CooperativeType.ANIMAL_HUSBANDRY:
        this.typeIcon = 'pets';
        break;
      case CooperativeType.DAIRY:
        this.typeIcon = 'water_drop';
        break;
      case CooperativeType.SAVINGS_AND_CREDIT:
        this.typeIcon = 'account_balance';
        break;
      case CooperativeType.MULTIPURPOSE:
        this.typeIcon = 'category';
        break;
      case CooperativeType.CONSUMER:
        this.typeIcon = 'shopping_cart';
        break;
      case CooperativeType.COFFEE:
      case CooperativeType.TEA:
        this.typeIcon = 'local_cafe';
        break;
      case CooperativeType.HANDICRAFT:
        this.typeIcon = 'handyman';
        break;
      case CooperativeType.FRUITS_AND_VEGETABLES:
        this.typeIcon = 'eco';
        break;
      case CooperativeType.BEE_KEEPING:
        this.typeIcon = 'emoji_nature';
        break;
      case CooperativeType.HEALTH:
        this.typeIcon = 'local_hospital';
        break;
      case CooperativeType.ELECTRICITY:
      case CooperativeType.ENERGY:
        this.typeIcon = 'bolt';
        break;
      case CooperativeType.COMMUNICATION:
        this.typeIcon = 'chat';
        break;
      case CooperativeType.TOURISM:
        this.typeIcon = 'luggage';
        break;
      case CooperativeType.ENVIRONMENT_CONSERVATION:
        this.typeIcon = 'park';
        break;
      case CooperativeType.TRANSPORTATION:
        this.typeIcon = 'directions_bus';
        break;
      case CooperativeType.SMALL_FARMERS:
        this.typeIcon = 'agriculture';
        break;
      case CooperativeType.WOMEN:
        this.typeIcon = 'person';
        break;
      default:
        this.typeIcon = 'business';
    }
  }

  getTypeTranslation(): string {
    if (!this.type) {
      return 'Unknown';
    }
    return `cooperative.types.${this.type.toLowerCase()}`;
  }
}
