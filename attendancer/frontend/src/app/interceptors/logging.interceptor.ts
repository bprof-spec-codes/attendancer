import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    const logMessage = 'Request URL: ' + req.url;

    // Elküldeni a logot a szervernek.
    this.http.post('http://localhost:5283/api/Log', { message: logMessage }).subscribe({
      next: (response) => console.log('Log sent successfully.'),
      error: (err) => console.error('Error sending log: ', err)
    });

    return handler.handle(req);
  }
}
