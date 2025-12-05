import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EventClient } from '../app.api-client.generated';
import { EditEventService } from '../services/edit-event-service';
import { EventViewDto } from '../models/event-view-dto';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { JwtDecodeService } from '../services/jwt-decode.service';

@Component({
  selector: 'app-sheet',
  standalone: false,
  templateUrl: './sheet.html',
  styleUrl: './sheet.sass'
})
export class Sheet implements OnInit {
  event: EventViewDto = new EventViewDto()
  presentCount: number = 0
  absentCount: number = 0

  modalTitle: string = ""
  modalMessage: string = ""
  private unsubscribe$ = new Subject<void>()

  public userId: string | null = null

  isMobile = false

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private eventClient: EventClient, 
    private editEventService: EditEventService, 
    public authService: AuthService, 
    private translate: TranslateService, 
    private jwtDecodeService: JwtDecodeService,
  ) {}

  private updateIsMobile() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.isMobile = window.matchMedia('(max-width: 1100px)').matches;
    }
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onResize() {
    this.updateIsMobile()
  }

  /**
   * Az oldal betöltésekor lekérdezni az adatokat az esemény id-ja alapján.
   */
  ngOnInit(): void {
    // Az id lekérdezése a route-ból.
    this.route.params.subscribe(params => {
      this.event.id = params['id']
    })

    // Ha nincsen id megadva akkor irányítson át a profile oldalra.
    if (this.event.id === undefined) {
      this.router.navigate(['/profile'])
    }

    // A modal fordítása.
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateTranslations()
      })

    // A bejelentkezett felhasználó userId-jének megszerzése.
    this.userId = this.jwtDecodeService.getUserId()

    // Az események és azok résztvevőinek lekérdezése az esemény id-je alapján.
    this.eventClient.getEventById(this.event.id).subscribe((response) => {
      // JSON formátumba konvertálni a választ.
      const reader = new FileReader()
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string)
        //console.log(jsonData)

        let counterParticipant = 0

        this.event = jsonData

        const eventDate = new Date(this.event.date).getTime()

        for (const p of jsonData.participants) {
          const participantDate = new Date(p.date).getTime()

          if (p.date) {
            // Az idő különbsége.
            const diffMilliseconds = eventDate - participantDate;

            // Ha 24 órán belül van akkor igaz (86400000 milliseconds).
            if (diffMilliseconds >= 0 && diffMilliseconds <= 86400000) {
              this.event.participants[counterParticipant].present = true;
            }
            else {
              this.event.participants[counterParticipant].present = false;
            }
          }
          else {
            this.event.participants[counterParticipant].present = false;
          }

          // Metadata hozzáadása.
          let counterMetadata = 0
          for (const m of jsonData.participants) {
            this.event.participants[counterParticipant].metadata = Object.values(jsonData.participants[counterParticipant].metadataDictionary)
            counterMetadata++
          }
          counterParticipant++  
        }

        // Kiszámolni a résztvevők és nem résztvevők számát.
        this.countPresent()
      }
      reader.readAsText(response.data)
    })
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
    this.editEventService.setEvent(this.event)
    this.router.navigate(['/editSheet'])
  }

  /**
   * A QR kód validálása.
   */
  onValidateQr() {
    this.eventClient.validateQr(this.event.id).subscribe({
      next: () => {
        console.log('QR validálva!')
        this.event.isQrValid = true
      },
      error: err => console.error('Hiba történt:', err.message)
    })
  }

  /**
   * A QR kód invalidálása.
   */
  onInvalidateQr() {
    this.eventClient.invalidateQr(this.event.id).subscribe({
      next: () => {
       console.log('QR invalidálva!')
       this.event.isQrValid = false
      },
      error: err => console.error('Hiba történt:', err.message)
    })
  }

  /**
   * A QR modal ezt emit-eli ki, hogy érvényes-e a QR kód.
   * @param isValid - boolean - Valid-e a QR kód.
   */
  setIsQrValid(isValid: boolean) {
    this.event.isQrValid = isValid
  }

  /**
   * Delete event by id and navigate to the profile page.
   */
  onDeleteEvent(): void {
    this.eventClient.deleteEvent(this.event.id).subscribe({
      next: () => {
        console.log('Esemény törölve!')
      },
      error: err => console.error('Hiba történt:', err.message)
    })

    this.router.navigate(['/profile'])
  }

  /**
   * A modal-hoz átadni a megfelelő nyelvű üzeneteket.
   */
  updateTranslations() {
    this.translate.get('MODAL.WARNING_TITLE').subscribe((res: string) => {
      this.modalTitle = res
    })

    this.translate.get('MODAL.EVENT_DELETE_CONFIRM_MESSAGE').subscribe((res: string) => {
      this.modalMessage = res
    })
  }
}
