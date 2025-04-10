import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  const lang = translocoService.getActiveLang();

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': lang,
    },
  });

  return next(modifiedReq);
};
