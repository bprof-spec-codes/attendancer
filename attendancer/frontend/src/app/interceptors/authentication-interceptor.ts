import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.tokenKey);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
