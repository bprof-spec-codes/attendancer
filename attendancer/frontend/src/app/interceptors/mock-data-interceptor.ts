import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { environment } from '../../environments/environment';
import { mergeMap, of } from 'rxjs';

export const mockDataInterceptor: HttpInterceptorFn = (req, next) => {
  /*const mockDataService = inject(MockDataService);

    if (req.url.endsWith('/api/User/login')) {
    return next(req);
  }

  const token = localStorage.getItem(environment.tokenKey);*/
  let modifiedReq = req;
/*
  if (token) {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  const { url, method } = req;

  if (method === 'GET' && url.match(/\/api\/Event\/\d+$/)) {
    const eventId = url.split('/').pop()!;
    return mockDataService.getEventById(eventId).pipe(
      mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
    );
  }

  if (method === 'GET' && url.match(/\/api\/Participant\/\d+$/)) {
    const id = url.split('/').pop()!;
    return mockDataService.getParticipantsByEventId(id).pipe(
      mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
    );
  }

  if (method === 'GET' && url.match(/\/api\/EventGroup\/\d+$/)) {
    const userId = url.split('/').pop()!;
    return mockDataService.getEventGroupsWithMetadataByUserId(userId).pipe(
      mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
    );
  }

  if (method === 'GET' && url.match(/\/api\/Event\/ByUser\/\d+$/)) {
    const userId = url.split('/').pop()!;
    return mockDataService.getEventsByUserId(userId).pipe(
      mergeMap(data => of(new HttpResponse({ status: 200, body: data })))
    );
  }

  if (method === 'POST' && url.endsWith('/api/Event')) {
    mockDataService.postEvent(req.body);
    return of(new HttpResponse({
      status: 201,
      body: { message: 'Event created (mock)' }
    }));
  }*/

  return next(modifiedReq);
};
