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
import {
  Breadcrumb,
  BreadcrumbConfig,
} from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslocoModule],
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

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
    let url = '';

    while (currentRoute) {
      const snapshot = currentRoute.snapshot;
      const data = snapshot.data;
      console.log('Processing route:', {
        url: snapshot.url,
        data: data,
        params: snapshot.params,
      });

      if (data['breadcrumb']) {
        const breadcrumbData = data['breadcrumb'];
        const routeUrl = snapshot.url.map((segment) => segment.path).join('/');
        if (routeUrl) {
          url += `/${routeUrl}`;
        }

        paths.push({
          label: breadcrumbData.label || '',
          translationKey: breadcrumbData.translationKey,
          url: url || '/',
          icon: breadcrumbData.icon,
          queryParams: snapshot.queryParams,
        });
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
