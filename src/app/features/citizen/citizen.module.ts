import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslocoModule } from '@jsverse/transloco';

// Store
import { citizenReducer } from './store/citizen.reducer';
import { CitizenEffects } from './store/citizen.effects';
import { CitizenFacade } from './store/citizen.facade';

// Services
import { CitizenService } from './services/citizen.service';
import { LocationService } from './services/location.service';
import { CitizenUrlParamsService } from './services/citizen-url-params.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    StoreModule.forFeature('citizen', citizenReducer),
    EffectsModule.forFeature([CitizenEffects]),
  ],
  providers: [
    CitizenService,
    LocationService,
    CitizenUrlParamsService,
    CitizenFacade,
  ],
})
export class CitizenModule {}
