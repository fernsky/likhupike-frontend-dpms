import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserFilter } from '../models/user.interface';
import { PermissionType } from '@app/core/models/permission.enum';

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
      if (page !== undefined && page >= 0) validParams.page = page;
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

  updateQueryParams(filter: UserFilter): void {
    // Convert filter to URL params with type safety
    const urlParams: Partial<Record<UrlParamKey, string>> = {};

    // Only include defined values
    if (filter.page !== undefined && filter.page > 0) {
      urlParams['page'] = filter.page.toString();
    }
    if (filter.size !== undefined && filter.size !== 10) {
      urlParams['size'] = filter.size.toString();
    }
    if (filter.sortBy && filter.sortBy !== 'createdAt') {
      urlParams['sortBy'] = filter.sortBy;
    }
    if (filter.sortDirection && filter.sortDirection !== 'DESC') {
      urlParams['sortDirection'] = filter.sortDirection;
    }
    if (filter.searchTerm) {
      urlParams['searchTerm'] = filter.searchTerm;
    }
    if (filter.email) {
      urlParams['email'] = filter.email;
    }
    if (filter.isApproved !== undefined && filter.isApproved !== null) {
      urlParams['isApproved'] = filter.isApproved.toString();
    }
    if (
      filter.isWardLevelUser !== undefined &&
      filter.isWardLevelUser !== null
    ) {
      urlParams['isWardLevelUser'] = filter.isWardLevelUser.toString();
    }
    if (filter.wardNumber !== undefined && filter.wardNumber !== null) {
      urlParams['wardNumber'] = filter.wardNumber.toString();
    }
    if (filter.permissions?.length) {
      urlParams['permissions'] = filter.permissions.join(',');
    }
    if (filter.createdAfter) {
      urlParams['createdAfter'] = filter.createdAfter;
    }
    if (filter.createdBefore) {
      urlParams['createdBefore'] = filter.createdBefore;
    }

    // Get current params
    const currentParams = new URLSearchParams(window.location.search);
    const clearedParams = new Set<string>();

    // Check which params need to be cleared
    currentParams.forEach((_, key) => {
      if (!(key in urlParams) && key !== 'page' && key !== 'size') {
        clearedParams.add(key);
      }
    });

    // Update URL by navigating to preserve history
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...urlParams,
        // Clear removed params by setting them to null
        ...[...clearedParams].reduce(
          (acc, key) => ({ ...acc, [key]: null }),
          {}
        ),
      },
      queryParamsHandling: 'merge',
      replaceUrl: true, // Use replaceUrl to avoid browser history entries
    });
  }

  convertToUserFilter(params: UrlParams): UserFilter {
    const filter: UserFilter = {};

    if (params.page !== undefined) filter.page = params.page;
    if (params.size !== undefined) filter.size = params.size;
    if (params.sortBy) filter.sortBy = params.sortBy;
    if (params.sortDirection) filter.sortDirection = params.sortDirection;
    if (params.searchTerm) filter.searchTerm = params.searchTerm;
    if (params.email) filter.email = params.email;
    if (params.isApproved !== undefined) filter.isApproved = params.isApproved;
    if (params.isWardLevelUser !== undefined)
      filter.isWardLevelUser = params.isWardLevelUser;
    if (params.wardNumber !== undefined) filter.wardNumber = params.wardNumber;
    if (params.permissions) {
      // Convert comma-separated string to PermissionType array
      filter.permissions = params.permissions
        .split(',')
        .filter((p): p is PermissionType => p in PermissionType);
    }
    if (params.createdAfter) filter.createdAfter = params.createdAfter;
    if (params.createdBefore) filter.createdBefore = params.createdBefore;

    return filter;
  }
}
