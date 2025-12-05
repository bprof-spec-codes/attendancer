import { Injectable } from '@angular/core';
import { EventCreateDto, EventGroupCreateDto, EventUpdateDto } from '../app.api-client.generated';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  constructor(private http: HttpClient) {}

  postEvent(eventCreateDto: EventCreateDto): Observable<string> {
    return this.http.post<string>(environment.apis.postEvent, eventCreateDto)
  }

  postEventGroup(eventGroupCreateDto: EventGroupCreateDto): Observable<any> {
    return this.http.post<any>(environment.apis.postEventGroup, eventGroupCreateDto)
  }

  updateEvent(eventUpdateDto: EventUpdateDto): Observable<any> {
    const url = environment.apis.updateEvent.replace('{id}', eventUpdateDto.id!);
    return this.http.put<any>(url, eventUpdateDto)
  }
}
