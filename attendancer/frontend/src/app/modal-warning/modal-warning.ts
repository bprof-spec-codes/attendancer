import { Component, Input } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-warning',
  standalone: false,
  templateUrl: './modal-warning.html',
  styleUrl: './modal-warning.sass'
})
export class ModalWarning {
  @Input() eventId: string = ""
  isOpen = false;

  constructor(private router: Router, private mockDataService: MockDataService) {}

  /**
   * Open warning modal.
   */
  public open(): void {
    this.isOpen = true;
  }

  /**
   * Close warning modal.
   */
  public close(): void {
    this.isOpen = false;
  }

  /**
   * Delete event by id and navigate to the create sheet page.
   */
  remove(): void {
    this.mockDataService.deleteEvent(this.eventId)
    this.router.navigate(['/createSheet']);
  }
}
