import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private translocoService: TranslocoService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const lang = this.translocoService.getActiveLang();

    request = request.clone({
      setHeaders: {
        'Accept-Language': lang,
        'Content-Type': 'application/json',
      },
    });

    return next.handle(request);
  }
}
