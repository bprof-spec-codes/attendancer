import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EventClient } from '../app.api-client.generated';
import { EditEventService } from '../services/edit-event-service';
import { EventViewDto } from '../models/event-view-dto';

@Component({
  selector: 'app-sheet',
  standalone: false,
  templateUrl: './sheet.html',
  styleUrl: './sheet.sass'
})
export class Sheet implements OnInit {
  eventId: string = ""
  event: EventViewDto = new EventViewDto()
  presentCount: number = 0
  absentCount: number = 0

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private eventClient: EventClient, 
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

    // Az események és azok résztvevőinek lekérdezése az esemény id-je alapján.
    this.eventClient.getEventById(this.eventId).subscribe((response) => {
      // JSON formátumba konvertálni a választ.
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string);

        //console.log(jsonData)

        // TODO ! Temp data convert. !

        let counterParticipant = 0
        this.event = jsonData;
        for (const p of jsonData.participants) {

          //console.log(p)

          // TODO ! Az adatbázisban a DateTime nem lehet null vagyis kell egy dátum szóval mindenki itt volt. !
          this.event.participants[counterParticipant].present = p.date ? true : false
          let counterMetadata = 0
          for (const m of jsonData.participants) {
            this.event.participants[counterParticipant].metadata = Object.values(jsonData.participants[counterParticipant].metadataDictionary)
            counterMetadata++
          }
          counterParticipant++  
        }

        // Kiszámolni a résztvevők és nem résztvevők számát.
        this.countPresent()
      };
      reader.readAsText(response.data);
    });
  }

  /**
   * A megjelent és hiányzó résztvevők kiszámítása.
   */
  countPresent(): void {
    for (let i = 0; i < this.event.participants.length; i++) {
      if (this.event.participants[i].present) {
        this.presentCount++
      }
    }

    this.absentCount = this.event.participants.length - this.presentCount
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
       this.event.isQrValid = false
    },
    error: err => console.error('Hiba történt:', err.message)
  });
  }
}
