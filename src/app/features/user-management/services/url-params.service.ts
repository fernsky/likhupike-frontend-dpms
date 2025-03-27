import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserFilter } from '../models/user.interface';
import { PermissionType } from '@app/core/models/permission.enum';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

// Define valid URL parameter keys
export type UrlParamKey =
  | 'page'
  | 'size'
  | 'sortBy'
  | 'sortDirection'
  | 'searchTerm'
  | 'email'
  | 'isApproved'
  | 'isWardLevelUser'
  | 'wardNumber'
  | 'permissions'
  | 'createdAfter'
  | 'createdBefore';

// Create a separate interface for URL parameters with explicit properties
export interface UrlParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  searchTerm?: string;
  email?: string;
  isApproved?: boolean;
  isWardLevelUser?: boolean;
  wardNumber?: number;
  permissions?: string;
  createdAfter?: string;
  createdBefore?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UrlParamsService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  parseQueryParams(params: Record<string, string>): UrlParams {
    const validParams: UrlParams = {};

    // Helper functions
    const parseBoolean = (value: string): boolean | undefined => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    };

    const parseNumber = (value: string): number | undefined => {
      const num = Number(value);
      return !isNaN(num) ? num : undefined;
    };

    // Type-safe parameter parsing
    if ('page' in params) {
      const page = parseNumber(params['page']);
      if (page !== undefined) {
        validParams.page = page === 0 ? 1 : page;
      }
    }

    if ('size' in params) {
      const size = parseNumber(params['size']);
      if (size !== undefined && size > 0) validParams.size = size;
    }

    if ('sortBy' in params) {
      validParams.sortBy = params['sortBy'];
    }

    if ('sortDirection' in params) {
      const direction = params['sortDirection'];
      if (['ASC', 'DESC'].includes(direction)) {
        validParams.sortDirection = direction as 'ASC' | 'DESC';
      }
    }

    if ('searchTerm' in params) {
      validParams.searchTerm = params['searchTerm'];
    }

    if ('email' in params) {
      validParams.email = params['email'];
    }

    if ('isApproved' in params) {
      const isApproved = parseBoolean(params['isApproved']);
      if (isApproved !== undefined) validParams.isApproved = isApproved;
    }

    if ('isWardLevelUser' in params) {
      const isWardLevelUser = parseBoolean(params['isWardLevelUser']);
      if (isWardLevelUser !== undefined) {
        validParams.isWardLevelUser = isWardLevelUser;
      }
    }

    if ('wardNumber' in params) {
      const wardNumber = parseNumber(params['wardNumber']);
      if (wardNumber !== undefined && wardNumber > 0) {
        validParams.wardNumber = wardNumber;
      }
    }

    if ('permissions' in params) {
      validParams.permissions = params['permissions'];
    }

    if ('createdAfter' in params) {
      const date = new Date(params['createdAfter']);
      if (!isNaN(date.getTime())) {
        validParams.createdAfter = params['createdAfter'];
      }
    }

    if ('createdBefore' in params) {
      const date = new Date(params['createdBefore']);
      if (!isNaN(date.getTime())) {
        validParams.createdBefore = params['createdBefore'];
      }
    }

    return validParams;
  }

  syncUrlToState(): Observable<UserFilter> {
    return this.route.queryParams.pipe(
      map((params) => this.convertToUserFilter(this.parseQueryParams(params))),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
  }

  updateQueryParams(filter: UserFilter): void {
    const urlParams: Partial<Record<UrlParamKey, string>> = {};

    // Only add defined values to URL params
    if (filter.page) urlParams['page'] = filter.page.toString();
    if (filter.size) urlParams['size'] = filter.size.toString();
    if (filter.sortBy) urlParams['sortBy'] = filter.sortBy;
    if (filter.sortDirection) urlParams['sortDirection'] = filter.sortDirection;
    if (filter.searchTerm?.trim())
      urlParams['searchTerm'] = filter.searchTerm.trim();
    if (filter.permissions?.length)
      urlParams['permissions'] = filter.permissions.join(',');
    if (filter.isApproved !== undefined)
      urlParams['isApproved'] = filter.isApproved.toString();
    if (filter.isWardLevelUser !== undefined)
      urlParams['isWardLevelUser'] = filter.isWardLevelUser.toString();
    if (filter.wardNumber !== undefined)
      urlParams['wardNumber'] = filter.wardNumber.toString();
    if (filter.email?.trim()) urlParams['email'] = filter.email.trim();
    if (filter.createdAfter) urlParams['createdAfter'] = filter.createdAfter;
    if (filter.createdBefore) urlParams['createdBefore'] = filter.createdBefore;

    // Update URL without triggering navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: urlParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  clearUrlParams(): void {
    // Clear all query parameters completely
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }

  convertToUserFilter(params: UrlParams): UserFilter {
    const filter: UserFilter = {};

    // Only add params that exist in URL, no defaults
    if (params.page) filter.page = Math.max(1, params.page);
    if (params.size) filter.size = params.size;
    if (params.sortBy) filter.sortBy = params.sortBy;
    if (params.sortDirection) filter.sortDirection = params.sortDirection;
    if (params.searchTerm) filter.searchTerm = params.searchTerm;
    if (params.permissions) {
      filter.permissions = params.permissions
        .split(',')
        .filter((p): p is PermissionType => p in PermissionType);
    }
    if (params.isApproved !== undefined) filter.isApproved = params.isApproved;
    if (params.isWardLevelUser !== undefined)
      filter.isWardLevelUser = params.isWardLevelUser;
    if (params.wardNumber !== undefined) filter.wardNumber = params.wardNumber;
    if (params.email) filter.email = params.email;
    if (params.createdAfter) filter.createdAfter = params.createdAfter;
    if (params.createdBefore) filter.createdBefore = params.createdBefore;

    return filter;
  }
}
