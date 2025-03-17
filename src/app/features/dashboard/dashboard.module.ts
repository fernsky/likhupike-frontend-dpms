import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DASHBOARD_ROUTES } from './dashboard.routes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    DashboardComponent,
  ],
})
export class DashboardModule {}
