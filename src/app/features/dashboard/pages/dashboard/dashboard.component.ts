import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

import * as AuthActions from '@app/core/store/auth/auth.actions';
import { SharedModule } from '@shared/shared.module';

import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { HeaderComponent } from '../../components/header/header.component';

// Import additional Angular Material modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    TranslocoModule,
    SidenavComponent,

    HeaderComponent, // Ensure HeaderComponent is included in imports
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  currentYear = new Date().getFullYear();

  isSidenavOpen = false; // Changed to false by default
  isMobileOpen = false;

  // Layout observables
  sidenavMode$: Observable<MatDrawerMode> = this.breakpointObserver
    .observe([Breakpoints.Handset, '(max-width: 1199px)'])
    .pipe(map(() => 'over')); // Changed to always use 'over' mode

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  showMenuToggle$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, '(max-width: 1199px)'])
    .pipe(map((result) => result.matches));

  constructor(
    private store: Store,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    console.log('Initialized.');
    // Initialize component
  }

  onSidenavToggle(): void {
    this.isMobileOpen = !this.isMobileOpen;
    if (this.sidenav) {
      this.sidenav.toggle();
      // Dispatch security event after successful toggle
    }
  }

  onToggleMenu(): void {
    this.isMobileOpen = !this.isMobileOpen;
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  onMobileClose(): void {
    this.isMobileOpen = false;
    this.isSidenavOpen = false; // Add this line to sync state
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  onHeaderMenuToggle(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    if (this.sidenav) {
      this.sidenav.toggle().then(() => {
        // Optional: Dispatch analytics event
        console.log('Sidenav toggled:', this.isSidenavOpen);
      });
    }
  }

  onBackdropClick(): void {
    this.isSidenavOpen = false;
    this.isMobileOpen = false;
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  onRefreshData(): void {}

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
