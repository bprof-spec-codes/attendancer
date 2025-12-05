import { Injectable } from '@angular/core';
import { EventCreateDto, FileResponse } from '../app.api-client.generated';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  constructor(private http: HttpClient) {}

  postSheet(eventCreateDto: EventCreateDto): Observable<string> {
    return this.http.post<string>("https://localhost:7198/api/Event", eventCreateDto)
  }
}
