/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export const unsavedChangesGuard = (
  component: CanComponentDeactivate,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState?: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  // If the component doesn't implement CanComponentDeactivate, allow navigation
  if (!component.canDeactivate) {
    return true;
  }

  // Ask the component if it's safe to deactivate
  const result = component.canDeactivate();

  // If the result is already a boolean, we're done
  if (typeof result === 'boolean') {
    return result;
  }

  // If it's a Promise<boolean> or Observable<boolean>, return it directly
  return result;
};

// Alternative version for components that don't implement the interface
export const genericUnsavedChangesGuard = (
  isDirty: () => boolean
): Observable<boolean> => {
  const dialog = inject(MatDialog);
  const transloco = inject(TranslocoService);

  if (!isDirty()) {
    return of(true);
  }

  const dialogRef = dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: transloco.translate('common.dialogs.unsavedChanges.title'),
      message: transloco.translate('common.dialogs.unsavedChanges.message'),
      confirmButton: transloco.translate(
        'common.dialogs.unsavedChanges.confirmButton'
      ),
      cancelButton: transloco.translate(
        'common.dialogs.unsavedChanges.cancelButton'
      ),
    },
  });

  return dialogRef.afterClosed();
};
