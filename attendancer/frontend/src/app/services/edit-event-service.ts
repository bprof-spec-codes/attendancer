import { Injectable } from '@angular/core';
import { EventViewDto } from '../models/event-view-dto';

@Injectable({
  providedIn: 'root',
})
export class EditEventService {
  private event: EventViewDto = new EventViewDto();

  setEvent(event: any) {
    this.event = event;

    if (event) {
      localStorage.setItem('temp_edit_event', JSON.stringify(event));
    }
  }

  getEvent(): any {
    if (this.event) {
      return this.event;
    }

    const storedEvent = localStorage.getItem('temp_edit_event');
    if (storedEvent) {
      this.event = JSON.parse(storedEvent);
      return this.event;
    }

    return undefined;
  }
}
