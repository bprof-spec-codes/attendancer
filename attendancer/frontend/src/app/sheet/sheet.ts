import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EventClient } from '../app.api-client.generated';

@Component({
  selector: 'app-sheet',
  standalone: false,
  templateUrl: './sheet.html',
  styleUrl: './sheet.sass'
})
export class Sheet implements OnInit {
  eventId: string = ""
  event: any = {
    name: "",
    id: "",
    qrCode: null,
    isQrValid: null,
    metadata: [],
    participants: []
  }
  presentCount: number = 0
  absentCount: number = 0

  constructor(private route: ActivatedRoute, private eventClient: EventClient, public authService: AuthService) {}

  /**
   * Az oldal betöltésekor lekérdezni az adatokat az esemény id-ja alapján.
   */
  ngOnInit(): void {
    // Az id lekérdezése a route-ból.
    this.route.params.subscribe(params => {
      this.eventId = params['id']
    })

    // Az események lekérdezése az esemény id-je alapján.
    this.eventClient.getEventById(this.eventId).subscribe((response) => {
      // JSON formátumba konvertálni a választ.
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string);
        this.event = jsonData;
        console.log(this.event);
      };
      reader.readAsText(response.data);
    });

    this.countPresent()
  }

  /**
   * Megjelent és hiányzó résztvevők kiszámítása.
   */
  countPresent(): void {
    for (let i = 0; i < this.event.participants.length; i++) {
      if (this.event.participants[i].present) {
        this.presentCount++
      }
    }

    this.absentCount = this.event.participants.length - this.presentCount
  }
}
