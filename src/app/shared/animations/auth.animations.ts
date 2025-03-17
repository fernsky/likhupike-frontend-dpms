import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  keyframes,
} from '@angular/animations';

export const authAnimations = {
  fadeSlideInOut: trigger('fadeSlideInOut', [
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateY(-20px)',
      }),
      animate(
        '400ms cubic-bezier(0.35, 0, 0.25, 1)',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
    ]),
    transition(':leave', [
      animate(
        '400ms cubic-bezier(0.35, 0, 0.25, 1)',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        }),
      ),
    ]),
  ]),

  formControls: trigger('formControls', [
    transition(':enter', [
      query(
        '.form-field',
        [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(100, [
            animate(
              '400ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({
                opacity: 1,
                transform: 'translateY(0)',
              }),
            ),
          ]),
        ],
        { optional: true },
      ),
    ]),
  ]),

  successState: trigger('successState', [
    transition(':enter', [
      style({ transform: 'scale(0.8)', opacity: 0 }),
      animate(
        '500ms cubic-bezier(0.4, 0, 0.2, 1)',
        keyframes([
          style({ offset: 0, transform: 'scale(0.8)', opacity: 0 }),
          style({ offset: 0.5, transform: 'scale(1.1)', opacity: 0.5 }),
          style({ offset: 1, transform: 'scale(1)', opacity: 1 }),
        ]),
      ),
    ]),
  ]),

  brandingAnimation: trigger('brandingAnimation', [
    transition(':enter', [
      query(
        '.gov-logo, .gov-title, .system-name-np, .system-name-en',
        [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(200, [
            animate(
              '600ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({
                opacity: 1,
                transform: 'translateY(0)',
              }),
            ),
          ]),
        ],
        { optional: true },
      ),
    ]),
  ]),

  errorShake: trigger('errorShake', [
    transition('* => *', [
      animate(
        '400ms ease-in-out',
        keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-10px)', offset: 0.2 }),
          style({ transform: 'translateX(10px)', offset: 0.4 }),
          style({ transform: 'translateX(-10px)', offset: 0.6 }),
          style({ transform: 'translateX(10px)', offset: 0.8 }),
          style({ transform: 'translateX(0)', offset: 1 }),
        ]),
      ),
    ]),
  ]),

  loadingState: trigger('loadingState', [
    state(
      'true',
      style({
        opacity: 0.7,
        filter: 'blur(2px)',
      }),
    ),
    state(
      'false',
      style({
        opacity: 1,
        filter: 'blur(0)',
      }),
    ),
    transition('false <=> true', animate('200ms ease-in-out')),
  ]),

  cardHover: trigger('cardHover', [
    state(
      'normal',
      style({
        transform: 'translateY(0)',
        boxShadow: 'var(--shadow-lg)',
      }),
    ),
    state(
      'hovered',
      style({
        transform: 'translateY(-4px)',
        boxShadow: 'var(--shadow-xl)',
      }),
    ),
    transition(
      'normal <=> hovered',
      animate('200ms cubic-bezier(0.35, 0, 0.25, 1)'),
    ),
  ]),
};

// Helper function to combine animations
export function combineAnimations(...animations: any[]) {
  return [...animations];
}
