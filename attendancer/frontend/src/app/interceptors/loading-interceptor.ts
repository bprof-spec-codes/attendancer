import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { LoadingSpinnerService } from '../services/loading-spinner-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingSpinner = inject(LoadingSpinnerService);

  // Betöltés mutatása a kérés indulásakor
  loadingSpinner.show();

  return next(req).pipe(finalize(() => loadingSpinner.hide()));
};
