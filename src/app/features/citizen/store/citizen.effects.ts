import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  catchError,
  exhaustMap,
  withLatestFrom,
  tap,
  filter,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { CitizenActions } from './citizen.actions';
import { CitizenService } from '../services/citizen.service';
import * as CitizenSelectors from './citizen.selectors';
import { CitizenUrlParamsService } from '../services/citizen-url-params.service';
import { DocumentType } from '../types';

@Injectable()
export class CitizenEffects {
  constructor(
    private actions$: Actions,
    private citizenService: CitizenService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService,
    private router: Router,
    private store: Store,
    private citizenUrlParamsService: CitizenUrlParamsService
  ) {}

  // Create citizen
  createCitizen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.createCitizen),
      exhaustMap(({ request }) =>
        this.citizenService.createCitizen(request).pipe(
          map((response) => {
            // Extract success message from API response
            this.showSuccess(
              'message' in response
                ? response.message
                : 'citizen.messages.createSuccess'
            );
            return CitizenActions.createCitizenSuccess({ response });
          }),
          catchError((error) => {
            console.error('Create citizen error:', error);
            this.showError(error.message || 'citizen.messages.createError');
            return of(CitizenActions.createCitizenFailure({ error }));
          })
        )
      )
    )
  );

  // Navigate after successful creation
  navigateAfterCreate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CitizenActions.createCitizenSuccess),
        tap(({ response }) => {
          // Navigate to the edit page of the newly created citizen
          if ('data' in response && response.data) {
            this.router.navigate([
              '/dashboard/citizens/edit',
              response.data.id,
            ]);
          }
        })
      ),
    { dispatch: false }
  );

  // Load citizens list
  loadCitizens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.loadCitizens),
      exhaustMap(({ filter }) =>
        this.citizenService.searchCitizens(filter).pipe(
          map((response) => {
            // Calculate pagination metadata
            const total =
              ('meta' in response && response.meta?.totalElements) ||
              ('data' in response && response.data.length) ||
              0;
            const pageSizeOrDefault = filter.size || 10;

            const meta = {
              currentPage: filter.page || 1,
              pageSize: pageSizeOrDefault,
              totalElements: total,
              totalPages: Math.ceil(total / pageSizeOrDefault),
              isFirst: (filter.page || 1) === 1,
              isLast:
                (filter.page || 1) >= Math.ceil(total / pageSizeOrDefault),
            };

            // Update URL params based on current filter
            this.citizenUrlParamsService.updateUrlFromFilters(filter);

            return CitizenActions.loadCitizensSuccess({ response, meta });
          }),
          catchError((error) => {
            console.error('Load citizens error:', error);
            this.showError(error.message || 'citizen.messages.loadError');
            return of(CitizenActions.loadCitizensFailure({ error }));
          })
        )
      )
    )
  );

  // Load single citizen
  loadCitizen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.loadCitizen),
      exhaustMap(({ id }) =>
        this.citizenService.getCitizenById(id).pipe(
          map((response) => {
            return CitizenActions.loadCitizenSuccess({ response });
          }),
          catchError((error) => {
            console.error('Load citizen error:', error);
            this.showError(error.message || 'citizen.messages.citizenNotFound');
            return of(CitizenActions.loadCitizenFailure({ error }));
          })
        )
      )
    )
  );

  // Update citizen
  updateCitizen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.updateCitizen),
      exhaustMap(({ id, request }) =>
        this.citizenService.updateCitizen(id, request).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'citizen.messages.updateSuccess'
            );
            return CitizenActions.updateCitizenSuccess({ response });
          }),
          catchError((error) => {
            console.error('Update citizen error:', error);
            this.showError(error.message || 'citizen.messages.updateError');
            return of(CitizenActions.updateCitizenFailure({ error }));
          })
        )
      )
    )
  );

  // Delete citizen
  deleteCitizen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.deleteCitizen),
      exhaustMap(({ id }) =>
        this.citizenService.deleteCitizen(id).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'citizen.messages.deleteSuccess'
            );
            return CitizenActions.deleteCitizenSuccess({ response, id });
          }),
          catchError((error) => {
            console.error('Delete citizen error:', error);
            this.showError(error.message || 'citizen.messages.deleteError');
            return of(CitizenActions.deleteCitizenFailure({ error }));
          })
        )
      )
    )
  );

  // Navigate after deletion
  navigateAfterDelete$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CitizenActions.deleteCitizenSuccess),
        tap(() => {
          // Navigate back to citizens list
          this.router.navigate(['/dashboard/citizens/list']);
        })
      ),
    { dispatch: false }
  );

  // Approve citizen
  approveCitizen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.approveCitizen),
      exhaustMap(({ id }) =>
        this.citizenService.approveCitizen(id).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'citizen.messages.approveSuccess'
            );
            return CitizenActions.approveCitizenSuccess({ response });
          }),
          catchError((error) => {
            console.error('Approve citizen error:', error);
            this.showError(error.message || 'citizen.messages.approveError');
            return of(CitizenActions.approveCitizenFailure({ error }));
          })
        )
      )
    )
  );

  // Upload document (photo, citizenship front/back)
  uploadDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.uploadDocument),
      exhaustMap(({ id, documentType, file }) => {
        let uploadCall;

        // Call the appropriate upload method based on document type
        switch (documentType) {
          case DocumentType.CITIZEN_PHOTO:
            uploadCall = this.citizenService.uploadCitizenPhoto(id, file);
            break;
          case DocumentType.CITIZENSHIP_FRONT:
            uploadCall = this.citizenService.uploadCitizenshipFront(id, file);
            break;
          case DocumentType.CITIZENSHIP_BACK:
            uploadCall = this.citizenService.uploadCitizenshipBack(id, file);
            break;
          default:
            // If unsupported document type, return error
            return of(
              CitizenActions.uploadDocumentFailure({
                error: {
                  status: 400,
                  message: 'Unsupported document type',
                },
                documentType,
              })
            );
        }

        return uploadCall.pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'citizen.messages.uploadSuccess'
            );
            return CitizenActions.uploadDocumentSuccess({
              response,
              documentType,
            });
          }),
          catchError((error) => {
            console.error('Upload document error:', error);
            this.showError(error.message || 'citizen.messages.uploadError');
            return of(
              CitizenActions.uploadDocumentFailure({ error, documentType })
            );
          })
        );
      })
    )
  );

  // Reload citizen after document upload to get the latest state
  reloadAfterUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.uploadDocumentSuccess),
      withLatestFrom(
        this.store.select(CitizenSelectors.selectSelectedCitizenId)
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([action, citizenId]) => {
        if (citizenId) {
          return CitizenActions.loadCitizen({ id: citizenId });
        }
        return { type: 'NO_ACTION' } as const; // Return a dummy action that will be filtered out
      }),
      // Filter out the dummy action
      filter((action) => action.type !== 'NO_ACTION')
    )
  );

  // Update citizen state
  updateCitizenState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.updateCitizenState),
      exhaustMap(({ id, stateUpdate }) =>
        this.citizenService.updateCitizenState(id, stateUpdate).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'citizen.messages.stateChangeSuccess'
            );
            return CitizenActions.updateCitizenStateSuccess({ response });
          }),
          catchError((error) => {
            console.error('Update citizen state error:', error);
            this.showError(
              error.message || 'citizen.messages.stateChangeError'
            );
            return of(CitizenActions.updateCitizenStateFailure({ error }));
          })
        )
      )
    )
  );

  // Update document state
  updateDocumentState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.updateDocumentState),
      exhaustMap(({ id, documentType, stateUpdate }) =>
        this.citizenService
          .updateDocumentState(id, documentType, stateUpdate)
          .pipe(
            map((response) => {
              this.showSuccess(
                'message' in response
                  ? response.message
                  : 'citizen.messages.documentStateChangeSuccess'
              );
              return CitizenActions.updateDocumentStateSuccess({ response });
            }),
            catchError((error) => {
              console.error('Update document state error:', error);
              this.showError(
                error.message || 'citizen.messages.documentStateChangeError'
              );
              return of(CitizenActions.updateDocumentStateFailure({ error }));
            })
          )
      )
    )
  );

  // Handle filter changes
  filterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.filterChange),
      withLatestFrom(this.store.select(CitizenSelectors.selectCurrentFilter)),
      map(([{ filter }, currentFilter]) => {
        // Merge the new filter with current filter
        const newFilter = {
          ...currentFilter,
          ...filter,
          // Only reset page if other filters change
          page:
            filter.page ??
            (Object.keys(filter).length > 0 && !('page' in filter)
              ? 1
              : (currentFilter.page ?? 1)),
        };

        return CitizenActions.loadCitizens({ filter: newFilter });
      })
    )
  );

  // Handle page changes
  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.setPage),
      map(({ pageIndex, pageSize }) => {
        const filter = { page: pageIndex, size: pageSize };
        return CitizenActions.filterChange({ filter });
      })
    )
  );

  // Reset filters
  resetFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.resetFilters),
      map(() => {
        const defaultFilter = {
          page: 1,
          size: 10,
          sortBy: 'createdAt',
          sortDirection: 'DESC' as 'ASC' | 'DESC',
        };

        // Clear URL params
        this.citizenUrlParamsService.clearUrlParams();

        return CitizenActions.loadCitizens({ filter: defaultFilter });
      })
    )
  );

  // Apply URL filters when directly navigating to a page with query params
  applyUrlFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CitizenActions.applyURLFilters),
      map(({ urlParams }) => {
        return CitizenActions.loadCitizens({
          filter:
            this.citizenUrlParamsService.parseUrlParamsToFilters(urlParams),
        });
      })
    )
  );

  // Refresh citizens list (e.g. after operations that might affect the list)
  refreshCitizens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CitizenActions.createCitizenSuccess,
        CitizenActions.updateCitizenSuccess,
        CitizenActions.deleteCitizenSuccess,
        CitizenActions.approveCitizenSuccess,
        CitizenActions.updateCitizenStateSuccess
      ),
      withLatestFrom(this.store.select(CitizenSelectors.selectCurrentFilter)),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([_, currentFilter]) => {
        return CitizenActions.loadCitizens({ filter: currentFilter });
      })
    )
  );

  // Helper method to show success messages
  private showSuccess(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  // Helper method to show error messages
  private showError(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
