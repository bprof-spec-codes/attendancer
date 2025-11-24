import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EditEventService } from '../services/edit-event-service';
import { EventClient } from '../app.api-client.generated';

@Component({
  selector: 'app-sheet',
  standalone: false,
  templateUrl: './sheet.html',
  styleUrl: './sheet.sass'
})
export class Sheet implements OnInit {
  eventId: string = ""
  event: any
  participants: any
  presentCount: number = 0
  absentCount: number = 0

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private mockDataService: MockDataService, 
    private editEventService: EditEventService, 
    public authService: AuthService,
    private eventService: EventClient
  ) {}

  /**
   * Az oldal betöltésekor lekérdezni az adatokat az esemény id-ja alapján.
   */
  ngOnInit(): void {
    // Az id lekérdezése a route-ból.
    this.route.params.subscribe(params => {
      this.eventId = params['id']
    })

    // Lekérdezni az esemény adatait.
    this.mockDataService.getEventById(this.eventId).subscribe((data) => {
      this.event = data;
    });

    // Lekérdezni az esemény résztvevőit.
    this.mockDataService.getParticipantsByEventId(this.eventId).subscribe((data) => {
      this.participants = data;
    });

    // Kiszámolni a résztvevők és nem résztvevők számát.
    this.countPresent()
  }

  /**
   * A megjelent és hiányzó résztvevők kiszámítása.
   */
  countPresent(): void {
    for (let i = 0; i < this.participants.length; i++) {
      if (this.participants[i].present) {
        this.presentCount++
      }
    }

    this.absentCount = this.participants.length - this.presentCount
  }

  /**
   * Átnavigálni az editSheet oldalra a jelenlegi esemény adataival.
   */
  edit(): void {
    this.editEventService.setEvent(this.event);
    this.router.navigate(['/editSheet']);
  }

  onValidateQr() {
    this.eventService.validateQr(this.eventId).subscribe({
     next: () => {
        console.log('QR validálva!');
      },
      error: err => console.error('Hiba történt:', err.message)
    });
  }

  onInvalidateQr() {
    this.eventService.invalidateQr(this.eventId).subscribe({
    next: () => {
       console.log('QR invalidálva!');
       this.event.valid = false
    },
    error: err => console.error('Hiba történt:', err.message)
  });
  }
}
