import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingSpinner: LoadingSpinner) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Betöltés mutatása egy HTTP kérés indításakor.
    this.loadingSpinner.show();

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          // A betöltés elrejtése a HTTP kérés visszatérésekor.
          if (event instanceof HttpResponse) {
            this.loadingSpinner.hide();
          }
        },
        error: () => {
          // A betöltés elrejtése hiba esetén.
          this.loadingSpinner.hide();
        }
      })
    );
  }
}
