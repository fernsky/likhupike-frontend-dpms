import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs/operators';

import * as AuthActions from '@app/core/store/auth/auth.actions';
import { SharedModule } from '@shared/shared.module';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TranslocoModule } from '@jsverse/transloco';

// Carbon breakpoint
const BREAKPOINT_MD = 1056;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TranslocoModule,
    SidenavComponent,
    HeaderComponent,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSidenavOpen = true;
  private destroy$ = new Subject<void>();

  // Simple observable for menu visibility based on Carbon's breakpoint
  showMenuToggle$: Observable<boolean> = this.breakpointObserver
    .observe([`(max-width: ${BREAKPOINT_MD}px)`])
    .pipe(map((result) => result.matches));

  constructor(
    private store: Store,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Set initial sidenav state based on screen size
    this.breakpointObserver
      .observe([`(max-width: ${BREAKPOINT_MD}px)`])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        // On mobile, keep sidenav closed by default
        this.isSidenavOpen = !result.matches;
      });
  }

  onHeaderMenuToggle(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  onMobileClose(): void {
    // Only close on mobile
    if (this.breakpointObserver.isMatched(`(max-width: ${BREAKPOINT_MD}px)`)) {
      this.isSidenavOpen = false;
    }
  }

  onSidenavToggle(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
