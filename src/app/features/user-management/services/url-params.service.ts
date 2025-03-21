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
      if (page !== undefined) {
        // Convert 0-based to 1-based if needed
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

  updateQueryParams(filter: UserFilter): void {
    const urlParams: Partial<Record<UrlParamKey, string>> = {};

    // Always include pagination and sort params
    urlParams['page'] = (filter.page ?? 1).toString();
    urlParams['size'] = (filter.size ?? 10).toString();
    urlParams['sortBy'] = filter.sortBy ?? 'createdAt';
    urlParams['sortDirection'] = filter.sortDirection ?? 'DESC';

    // Include all other defined params without any filtering
    if (filter.searchTerm) urlParams['searchTerm'] = filter.searchTerm;
    if (filter.permissions?.length)
      urlParams['permissions'] = filter.permissions.join(',');
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
    if (filter.email) urlParams['email'] = filter.email;
    if (filter.createdAfter) urlParams['createdAfter'] = filter.createdAfter;
    if (filter.createdBefore) urlParams['createdBefore'] = filter.createdBefore;

    // Update URL preserving query parameters that are not being updated
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: urlParams,
      queryParamsHandling: null, // Don't merge
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
