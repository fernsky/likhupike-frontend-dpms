import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

interface Breadcrumb {
  label: string;
  path: string;
  translationKey?: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    // Clear any existing breadcrumbs
    this.breadcrumbs = [];

    // Track processed translation keys to avoid duplicates
    const processedKeys = new Set<string>();

    // Start with the root route
    let route = this.activatedRoute.root;
    let url = '';

    // Find all parent routes with breadcrumb data
    const addBreadcrumb = (route: ActivatedRoute): void => {
      if (
        route.routeConfig &&
        route.routeConfig.data &&
        route.routeConfig.data['breadcrumb']
      ) {
        const breadcrumbData = route.routeConfig.data['breadcrumb'];

        // Only add if we haven't already processed this translation key
        if (
          breadcrumbData.translationKey &&
          !processedKeys.has(breadcrumbData.translationKey)
        ) {
          processedKeys.add(breadcrumbData.translationKey);

          this.breadcrumbs.push({
            label: breadcrumbData.label || '',
            translationKey: breadcrumbData.translationKey,
            path: breadcrumbData.path || this.router.url,
          });
        }
      }

      // Process parent route if it exists
      if (route.parent) {
        addBreadcrumb(route.parent);
      }
    };

    // Find the active route
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.url.length) {
        url +=
          '/' + route.snapshot.url.map((segment) => segment.path).join('/');
      }
    }

    // Process the active route and its parents
    if (route.snapshot.data['breadcrumb']) {
      const breadcrumbData = route.snapshot.data['breadcrumb'];

      this.breadcrumbs.push({
        label: breadcrumbData.label || '',
        translationKey: breadcrumbData.translationKey,
        path: breadcrumbData.path || url,
      });

      processedKeys.add(breadcrumbData.translationKey || '');
    }

    // Process parent routes
    if (route.parent) {
      addBreadcrumb(route.parent);
    }

    // Reverse the breadcrumbs to get them in the correct order
    this.breadcrumbs = this.breadcrumbs.reverse();
  }
}
