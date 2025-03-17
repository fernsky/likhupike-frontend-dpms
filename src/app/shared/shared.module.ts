import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePipe } from '@angular/common';

// Material Modules
import { SharedMaterialModule } from './shared-material.module';

import { HighlightOnHoverDirective } from './directives/highlight-on-hover.directive';
import { ScrollToTopDirective } from './directives/scroll-to-top.directive';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';

const SHARED_MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  SharedMaterialModule,
] as const;

// All components are now standalone
const STANDALONE_COMPONENTS = [
  ScrollToTopDirective,
  HighlightOnHoverDirective,

  SafeHtmlPipe,
  LocalizedDatePipe,
] as const;

@NgModule({
  imports: [...SHARED_MODULES, ...STANDALONE_COMPONENTS],
  exports: [...SHARED_MODULES, ...STANDALONE_COMPONENTS],
  providers: [DatePipe, LocalizedDatePipe],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
