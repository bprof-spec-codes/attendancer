import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EventClient, ParticipantClient } from '../app.api-client.generated';

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

  constructor(private route: ActivatedRoute, private eventClient: EventClient, private participantClient: ParticipantClient, private mockDataService: MockDataService, public authService: AuthService) {}

  /**
   * Az oldal betöltésekor lekérdezni az adatokat az esemény id-ja alapján.
   */
  ngOnInit(): void {
    // Az id lekérdezése a route-ból.
    this.route.params.subscribe(params => {
      this.eventId = params['id']
    })

    this.eventClient.getEventById(this.eventId).subscribe((data) => {
      this.event = data;
    });

    /*this.participantClient.getParticipantsByEventId(this.eventId).subscribe((data) => {
      this.participants = data;
    });*/

    /*this.mockDataService.getEventById(this.eventId).subscribe((data) => {
      this.event = data;
    });*/

    this.mockDataService.getParticipantsByEventId(this.eventId).subscribe((data) => {
      this.participants = data;
    });

    this.countPresent()
  }

  /**
   * Megjelent és hiányzó résztvevők kiszámítása.
   */
  countPresent(): void {
    for (let i = 0; i < this.participants.length; i++) {
      if (this.participants[i].present) {
        this.presentCount++
      }
    }

    this.absentCount = this.participants.length - this.presentCount
  }
}
