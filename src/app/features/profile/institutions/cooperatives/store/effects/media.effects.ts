import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

import { CooperativeMediaService } from '../../services/cooperative-media.service';
import { CooperativeMediaActions } from '../actions';

@Injectable()
export class MediaEffects {
  constructor(
    private actions$: Actions,
    private mediaService: CooperativeMediaService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}

  // Load media for a cooperative
  loadMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.loadMedia),
      switchMap(({ cooperativeId, page, size }) =>
        this.mediaService.getAllMediaForCooperative(cooperativeId, page, size).pipe(
          map((response) =>
            CooperativeMediaActions.loadMediaSuccess({
              cooperativeId,
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadMediaError');
            return of(CooperativeMediaActions.loadMediaFailure({ error }));
          })
        )
      )
    )
  );

  // Load media by type
  loadMediaByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.loadMediaByType),
      switchMap(({ cooperativeId, mediaType, page, size }) =>
        this.mediaService.getMediaByType(cooperativeId, mediaType, page, size).pipe(
          map((response) =>
            CooperativeMediaActions.loadMediaSuccess({
              cooperativeId,
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadMediaError');
            return of(CooperativeMediaActions.loadMediaFailure({ error }));
          })
        )
      )
    )
  );

  // Load a specific media item by ID
  loadMediaItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.loadMediaItem),
      switchMap(({ cooperativeId, mediaId }) =>
        this.mediaService.getMediaById(cooperativeId, mediaId).pipe(
          map((response) =>
            CooperativeMediaActions.loadMediaItemSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadMediaItemError');
            return of(CooperativeMediaActions.loadMediaItemFailure({ error }));
          })
        )
      )
    )
  );

  // Upload media
  uploadMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.uploadMedia),
      exhaustMap(({ cooperativeId, file, metadata }) =>
        this.mediaService.uploadMedia(cooperativeId, file, metadata).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.uploadMediaSuccess');
            return CooperativeMediaActions.uploadMediaSuccess({
              cooperativeId,
              response,
            });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.uploadMediaError');
            return of(CooperativeMediaActions.uploadMediaFailure({ error }));
          })
        )
      )
    )
  );

  // Update media metadata
  updateMediaMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.updateMediaMetadata),
      exhaustMap(({ cooperativeId, mediaId, metadata }) =>
        this.mediaService.updateMediaMetadata(cooperativeId, mediaId, metadata).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.updateMetadataSuccess');
            return CooperativeMediaActions.updateMetadataSuccess({
              response,
            });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.updateMetadataError');
            return of(CooperativeMediaActions.updateMetadataFailure({ error }));
          })
        )
      )
    )
  );

  // Delete media
  deleteMedia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.deleteMedia),
      exhaustMap(({ cooperativeId, mediaId }) =>
        this.mediaService.deleteMedia(cooperativeId, mediaId).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.deleteMediaSuccess');
            return CooperativeMediaActions.deleteMediaSuccess({
              cooperativeId,
              mediaId,
              response,
            });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.deleteMediaError');
            return of(CooperativeMediaActions.deleteMediaFailure({ error }));
          })
        )
      )
    )
  );

  // Set media as primary
  setMediaAsPrimary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.setMediaAsPrimary),
      exhaustMap(({ cooperativeId, mediaId }) =>
        this.mediaService.setMediaAsPrimary(cooperativeId, mediaId).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.setPrimarySuccess');
            return CooperativeMediaActions.setPrimarySuccess({
              cooperativeId,
              response,
            });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.setPrimaryError');
            return of(CooperativeMediaActions.setPrimaryFailure({ error }));
          })
        )
      )
    )
  );

  // Update media visibility
  updateMediaVisibility$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.updateMediaVisibility),
      exhaustMap(({ cooperativeId, mediaId, status }) =>
        this.mediaService
          .updateMediaVisibility(cooperativeId, mediaId, status)
          .pipe(
            map((response) => {
              this.showSuccess('cooperative.messages.updateVisibilitySuccess');
              return CooperativeMediaActions.updateVisibilitySuccess({
                cooperativeId,
                response,
              });
            }),
            catchError((error) => {
              this.showError('cooperative.messages.updateVisibilityError');
              return of(
                CooperativeMediaActions.updateVisibilityFailure({ error })
              );
            })
          )
      )
    )
  );

  // Reload media after successful upload
  reloadAfterUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeMediaActions.uploadMediaSuccess),
      map(({ cooperativeId }) =>
        CooperativeMediaActions.loadMedia({
          cooperativeId,
          page: 0,
          size: 10,
        })
      )
    )
  );

  // Helper methods
  private showSuccess(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  private showError(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
