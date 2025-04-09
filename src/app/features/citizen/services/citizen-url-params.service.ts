import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CitizenSearchFilters, CitizenState, DocumentState } from '../types';

@Injectable({
  providedIn: 'root',
})
export class CitizenUrlParamsService {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Update the URL query parameters based on the current filters
   * @param filters - The filter object to be reflected in the URL
   */
  updateUrlFromFilters(filters: CitizenSearchFilters): void {
    // Create a params object from filters, excluding undefined/null values
    const queryParams: Record<string, string> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays by converting to comma-separated strings
        if (Array.isArray(value)) {
          queryParams[key] = value.join(',');
        } else {
          queryParams[key] = value.toString();
        }
      }
    });

    // Update the URL without navigating
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge', // Keep other params not changed
      replaceUrl: true, // Don't add to browser history
    });
  }

  /**
   * Parse URL query parameters into a CitizenSearchFilters object
   * @param params - The URL query parameters
   * @returns CitizenSearchFilters object
   */
  parseUrlParamsToFilters(
    params: Record<string, string>
  ): CitizenSearchFilters {
    const filters: Partial<CitizenSearchFilters> = {};

    // Handle pagination and sorting
    if (params['page']) filters.page = parseInt(params['page'], 10);
    if (params['size']) filters.size = parseInt(params['size'], 10);
    if (params['sortBy']) filters.sortBy = params['sortBy'];
    if (params['sortDirection']) {
      filters.sortDirection = params['sortDirection'] as 'ASC' | 'DESC';
    }

    // Handle basic string filters
    const stringFields = [
      'name',
      'nameDevnagari',
      'citizenshipNumber',
      'citizenshipIssuedOffice',
      'email',
      'phoneNumber',
      'notesSearch',
      'addressTerm',
      'permanentProvinceCode',
      'permanentDistrictCode',
      'permanentMunicipalityCode',
      'updatedByUserId',
    ];

    stringFields.forEach((field) => {
      if (params[field]) {
        // Use type assertion to tell TypeScript this is a string property
        (filters as Record<string, string>)[field] = params[field];
      }
    });

    // Handle date filters
    const dateFields = [
      'citizenshipIssuedDateStart',
      'citizenshipIssuedDateEnd',
      'createdAfter',
      'createdBefore',
      'stateUpdatedAfter',
      'stateUpdatedBefore',
    ];

    dateFields.forEach((field) => {
      if (params[field]) {
        // Convert string to Date object for date fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (filters as any)[field] = new Date(params[field]);
      }
    });

    // Handle numeric values
    if (params['permanentWardNumber']) {
      filters.permanentWardNumber = parseInt(params['permanentWardNumber'], 10);
    }

    // Handle boolean values
    if (params['isApproved'] !== undefined) {
      filters.isApproved = params['isApproved'] === 'true';
    }

    // Handle enum values
    if (params['state']) {
      filters.state = params['state'] as CitizenState;
    }

    if (params['photoState']) {
      filters.photoState = params['photoState'] as DocumentState;
    }

    if (params['citizenshipFrontState']) {
      filters.citizenshipFrontState = params[
        'citizenshipFrontState'
      ] as DocumentState;
    }

    if (params['citizenshipBackState']) {
      filters.citizenshipBackState = params[
        'citizenshipBackState'
      ] as DocumentState;
    }

    // Handle array values
    if (params['states']) {
      filters.states = params['states'].split(',') as CitizenState[];
    }

    if (params['documentStates']) {
      filters.documentStates = params['documentStates'].split(
        ','
      ) as DocumentState[];
    }

    if (params['columns']) {
      filters.columns = params['columns'].split(',');
    }

    return filters as CitizenSearchFilters;
  }

  /**
   * Extract filters from the current URL
   * @returns CitizenSearchFilters object
   */
  getFiltersFromCurrentUrl(): CitizenSearchFilters {
    // Get current query params
    const params: Record<string, string> = {};

    this.route.snapshot.queryParamMap.keys.forEach((key) => {
      const value = this.route.snapshot.queryParamMap.get(key);
      if (value !== null) {
        params[key] = value;
      }
    });

    return this.parseUrlParamsToFilters(params);
  }

  /**
   * Clear all URL query parameters
   */
  clearUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }
}
