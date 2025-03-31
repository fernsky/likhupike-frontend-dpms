import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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
export class DashboardComponent implements OnInit {
  isSidenavOpen = true;

  // Simple observable for menu visibility based on Carbon's breakpoint
  showMenuToggle$: Observable<boolean> = this.breakpointObserver
    .observe([`(max-width: ${BREAKPOINT_MD}px)`])
    .pipe(map((result) => result.matches));

  constructor(
    private store: Store,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    // Set initial sidenav state based on screen size
    this.breakpointObserver
      .observe([`(max-width: ${BREAKPOINT_MD}px)`])
      .subscribe((result) => {
        this.isSidenavOpen = !result.matches;
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  onHeaderMenuToggle(): void {
    this.isSidenavOpen = !this.isSidenavOpen;

    // For debugging
    console.log('Sidenav toggled:', this.isSidenavOpen);
  }

  onMobileClose(): void {
    if (this.breakpointObserver.isMatched(`(max-width: ${BREAKPOINT_MD}px)`)) {
      this.isSidenavOpen = false;
    }
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
