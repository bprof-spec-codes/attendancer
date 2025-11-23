import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // AuthToken - a token neve ahogy el van tárolva
    const token = localStorage.getItem(environment.tokenKey);


    // Ha van token akkor az API headers-et leklónozni és a leklónozott kérésbe belerakni a tokent.
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(cloned);
    }

    // Ha nincs token akkor változtatás nélkül tovább küldi a kérést.
    return next.handle(req);
  }
}
