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
    const paths: Breadcrumb[] = [];
    let currentRoute: ActivatedRoute | null = this.activatedRoute;

    while (currentRoute?.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    while (currentRoute) {
      const snapshot = currentRoute.snapshot;
      const data = snapshot.data;

      if (data['breadcrumb']) {
        const breadcrumbData = data['breadcrumb'];
        paths.push({
          label: breadcrumbData.label || '',
          translationKey: breadcrumbData.translationKey,
          path: breadcrumbData.path,
        });
      }

      currentRoute = currentRoute.parent;
    }

    this.breadcrumbs = paths.reverse();
  }
}
