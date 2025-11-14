import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditEventService {
  private event: any

  setEvent(event: any): void {
    this.event = event
  }

  getEvent(): any {
    return this.event
  }
}
