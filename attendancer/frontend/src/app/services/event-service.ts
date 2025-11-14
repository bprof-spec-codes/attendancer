import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventModel } from '../models/event-model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  _events = new BehaviorSubject<EventModel[]>([])
  events = this._events.asObservable()

  constructor(private http: HttpClient) {}

  getEvents(){
    this.http.get<EventModel[]>(`${environment.apis.event}/get`).subscribe(event => {
      this._events.next(event)
    })
  }

  generateQr(eventId: string) : Observable<any>{
    console.log("Qr generated")
    return this.http.post(`${environment.apis.event}/${eventId}/generate-qr`, {})
  }

  invalidateQr(eventId: string){
    console.log("Qr deleted")
    return this.http.post(`${environment.apis.event}/${eventId}/invalidate`, {})
  }

  validateQr(eventId: string){
    console.log("Qr created")
    return this.http.post(`${environment.apis.event}/${eventId}/validate`, {})
  }

}
