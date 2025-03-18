import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { filter, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Breadcrumb, BreadcrumbConfig } from './breadcrumb.interface';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TranslocoModule,
    MatTooltipModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'breadcrumbs',
      alias: 'breadcrumbs',
    }),
  ],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() config: BreadcrumbConfig = {
    separator: 'chevron_right',
    showIcons: true,
  };

  breadcrumbs: Breadcrumb[] = [];
  private destroy$ = new Subject<void>();
  isCompact = false;
  showOnlyIcons = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isCompact = result.matches;
        this.showOnlyIcons = result.breakpoints[Breakpoints.XSmall];
      });
  }

  ngOnInit(): void {
    console.log('Breadcrumb component initialized');
    this.updateBreadcrumbs();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        console.log('Navigation ended, updating breadcrumbs');
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs(): void {
    let currentRoute: ActivatedRoute | null = this.activatedRoute;
    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const paths: Breadcrumb[] = [];
    const processedKeys = new Set<string>();

    while (currentRoute) {
      const snapshot = currentRoute.snapshot;
      const data = snapshot.data;

      if (data['breadcrumb']) {
        const breadcrumbData = data['breadcrumb'];

        if (!processedKeys.has(breadcrumbData.translationKey)) {
          processedKeys.add(breadcrumbData.translationKey);
          paths.push({
            label: breadcrumbData.label || '',
            translationKey: breadcrumbData.translationKey,
            url: breadcrumbData.path,
            path: breadcrumbData.path,
            icon: breadcrumbData.icon,
            queryParams: snapshot.queryParams,
          });
        }
      }

      currentRoute = currentRoute.parent;
    }

    this.breadcrumbs = paths.reverse();
    console.log('Updated breadcrumbs:', this.breadcrumbs);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
