import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PopupService } from '../popup/popup.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

const getErrorMsgByStatus = (status: number): string => {
  switch (status) {
    case 0:
      return 'Failed to connect to the server. Please check your internet connection.';
    case 401:
      return 'You need to be logged in to perform this action.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'A server error occurred, please try again later.';
    default:
      return 'An unknown error has occurred.';
  }
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const popup = inject(PopupService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      popup.show(getErrorMsgByStatus(error.status), 4000);
      return throwError(() => error);
    })
  );
};
