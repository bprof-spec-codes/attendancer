import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, Observable, of } from 'rxjs';
import { MockDataService } from '../services/mock-data.service';


@Injectable()
export class MockDataInterceptor implements HttpInterceptor {

 constructor(private mockDataService: MockDataService) {}

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     const token = localStorage.getItem('AuthToken');
    let modifiedReq = req;

    if (token) {
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }

    const { url, method } = req;

    if (method === 'GET' && url.match(/\/api\/Event\/\d+$/)) {
      const eventId = url.split('/').pop()!;
      return this.mockDataService.getEventById(eventId).pipe(
        mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
      );
    }

    if (method === 'GET' && url.match(/\/api\/Participant\/\d+$/)) {
      const eventId = url.split('/').pop()!;
      return this.mockDataService.getParticipantsByEventId(eventId).pipe(
        mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
      );
    }

    if (method === 'GET' && url.match(/\/api\/EventGroup\/\d+$/)) {
      const userId = url.split('/').pop()!;
      return this.mockDataService.getEventGroupsWithMetadataByUserId(userId).pipe(
        mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
      );
    }

    if (method === 'GET' && url.match(/\/api\/Event\/ByUser\/\d+$/)) {
      const userId = url.split('/').pop()!;
      return this.mockDataService.getEventsByUserId(userId).pipe(
        mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
      );
    }

    if (method === 'POST' && url.endsWith('/api/Event')) {
      this.mockDataService.postEvent(req.body);
      return of(new HttpResponse({ status: 201, body: { message: 'Event created (mock)' } }));
    }

    return next.handle(modifiedReq);
  
  }
}
