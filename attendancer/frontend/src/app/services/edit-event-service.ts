import { Injectable } from '@angular/core';
import { EventViewDto } from '../models/event-view-dto';

@Injectable({
  providedIn: 'root'
})
export class EditEventService {
  private event: EventViewDto = new EventViewDto()

  setEvent(event: any): void {
    this.event = event
  }

  getEvent(): any {
    return this.event
  }
}
