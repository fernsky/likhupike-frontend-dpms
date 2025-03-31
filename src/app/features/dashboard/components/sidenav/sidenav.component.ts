import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import * as AuthSelectors from '@app/core/store/auth/auth.selectors';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { filter, takeUntil, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';

import { PermissionType } from '@app/core/models/permission.enum';

import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  SideNavModule,
  UIShellModule,
  IconModule,
} from 'carbon-components-angular';

interface NavItem {
  id: string;
  label: string;
  labelNp: string;
  icon: string;
  route?: string;
  permissions?: PermissionType[];
  children?: NavItem[];
  badge?: {
    value: number;
    color: 'primary' | 'accent' | 'warn';
  };
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('submenuAnimation', [
      state(
        'collapsed',
        style({
          height: '0',
          overflow: 'hidden',
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          visibility: 'visible',
        })
      ),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    TranslocoModule,
    SideNavModule,
    UIShellModule,
    IconModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'sidenav',
      alias: 'sidenav',
    }),
    provideTranslocoScope({
      scope: 'government-branding',
      alias: 'govBranding',
    }),
  ],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Input() rail = false; // Add rail input to match Carbon sidenav
  @Input() expanded = true; // Add expanded input
  @Output() mobileClose = new EventEmitter<void>();
  @Output() mobileToggle = new EventEmitter<void>();
  @Output() selectedChange = new EventEmitter<string>(); // Add event emitter for selection

  theme = 'g100'; // Add theme property for Carbon
  isHandset$: Observable<boolean>;
  currentUrl = '';
  expandedMenus = new Set<string>();
  currentLang = 'en';
  private destroy$ = new Subject<void>();

  readonly navigationItems: NavItem[] = [
    {
      id: 'user-management',
      label: 'User Management',
      labelNp: 'प्रयोगकर्ता व्यवस्थापन',
      icon: 'people',
      children: [
        {
          id: 'user-list',
          label: 'User List',
          labelNp: 'प्रयोगकर्ता सूची',
          icon: 'list',
          route: '/dashboard/users/list',
          permissions: [PermissionType.VIEW_USER],
        },
        {
          id: 'user-create',
          label: 'Add New User',
          labelNp: 'नयाँ प्रयोगकर्ता',
          icon: 'person_add',
          route: '/dashboard/users/create',
          permissions: [PermissionType.CREATE_USER],
        },
      ],
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private translocoService: TranslocoService
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
  }

  ngOnInit(): void {
    this.setupRouteListener();
    this.setupLanguageListener();
  }

  private setupLanguageListener(): void {
    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
      });
  }

  onSelected(item: NavItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
      this.mobileClose.emit();
    }
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  toggleMenu(menuId: string): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isRouteActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.currentUrl.startsWith(route);
  }

  getItemLabel(item: NavItem): string {
    return this.currentLang === 'ne' ? item.labelNp : item.label;
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
    this.mobileClose.emit();
  }

  closeMobileNav(): void {
    this.mobileClose.emit();
  }

  toggleMobileNav(): void {
    this.mobileToggle.emit();
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        this.expandParentItems(this.currentUrl);
        this.announceCurrentPage();
      });
  }

  private expandParentItems(url: string): void {
    this.navigationItems.forEach((item) => {
      if (item.children?.some((child) => child.route === url)) {
        this.expandedMenus.add(item.id);
      }
    });
  }

  private announceCurrentPage(): void {
    const currentItem = this.findCurrentNavigationItem(this.navigationItems);
    if (currentItem) {
      // Could implement screen reader announcement here if needed
    }
  }

  private findCurrentNavigationItem(items: NavItem[]): NavItem | undefined {
    for (const item of items) {
      if (item.route === this.currentUrl) {
        return item;
      }
      if (item.children) {
        const found = this.findCurrentNavigationItem(item.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  hasPermission(requiredPermissions?: PermissionType[]): Observable<boolean> {
    if (!requiredPermissions?.length) return of(true);

    return this.store.select(AuthSelectors.selectUserPermissions).pipe(
      map((permissions) => Array.from(permissions)),
      map((userPermissions) =>
        requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
