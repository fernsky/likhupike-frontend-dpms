import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MUNICIPALITY_FEATURE_KEY, municipalityReducer } from './municipality.reducer';
import { MunicipalityEffects } from './municipality.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(MUNICIPALITY_FEATURE_KEY, municipalityReducer),
    EffectsModule.forFeature([MunicipalityEffects])
  ]
})
export class MunicipalityStoreModule {}
