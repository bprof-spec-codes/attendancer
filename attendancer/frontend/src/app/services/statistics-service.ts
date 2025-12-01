import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

export interface MatrixEventColumnDto {
  eventId: string;
  eventName: string;
}

export interface MatrixParticipantRowDto {
  userId: string;
  userName: string;
  userEmail: string;
  attendances: { [eventId: string]: boolean };
}

export interface EventGroupMatrixViewDto {
  eventGroupId: string;
  eventGroupName: string;
  events: MatrixEventColumnDto[];
  participants: MatrixParticipantRowDto[];
}

export interface EventGroupDto {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) {}

  getMyEventGroups(): Observable<EventGroupDto[]> {
    return this.http.get<EventGroupDto[]>(environment.apis.eventGroupByUserId);
  }

  getEventGroupMatrix(eventGroupId: string): Observable<EventGroupMatrixViewDto> {
    return this.http.get<EventGroupMatrixViewDto>(
      environment.apis.eventGroupView.replace('{eventGroupId}', eventGroupId)
    );
  }

}

