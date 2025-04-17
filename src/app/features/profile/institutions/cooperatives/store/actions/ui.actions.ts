import { createActionGroup, emptyProps, props } from '@ngrx/store';

/**
 * Actions for UI state management
 */
export const CooperativeUIActions = createActionGroup({
  source: 'Cooperative UI',
  events: {
    // Modal and Dialog State
    'Open Create Dialog': emptyProps(),
    'Close Create Dialog': emptyProps(),
    'Open Edit Dialog': props<{ id: string }>(),
    'Close Edit Dialog': emptyProps(),
    'Open Delete Dialog': props<{ id: string; name: string }>(),
    'Close Delete Dialog': emptyProps(),
    'Open Media Upload Dialog': props<{ cooperativeId: string }>(),
    'Close Media Upload Dialog': emptyProps(),
    'Open Media View Dialog': props<{ mediaId: string }>(),
    'Close Media View Dialog': emptyProps(),

    // Tab Navigation
    'Set Active Tab': props<{ tabIndex: number }>(),

    // URL Sync
    'Sync Url To State': emptyProps(),
    'Update Query Params': props<{
      [param: string]: string | number | boolean | null;
    }>(),
  },
});
