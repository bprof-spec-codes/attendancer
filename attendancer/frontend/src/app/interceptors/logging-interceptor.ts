import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api/Log')) {
    const http = inject(HttpClient);
    const logMessage = 'Request URL: ' + req.url;

    http
      .post('http://localhost:5283/api/Log', { message: logMessage }, { responseType: 'text' })
      .subscribe({
        next: (res) => /*console.log('Log sent successfully.', res)*/{},
        error: (err) => console.error('Error sending log: ', err),
      });
  }

  return next(req);
};
