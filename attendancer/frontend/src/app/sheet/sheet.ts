import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EventClient } from '../app.api-client.generated';
import { EditEventService } from '../services/edit-event-service';
import { EventViewDto } from '../models/event-view-dto';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

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
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private eventClient: EventClient, 
    private editEventService: EditEventService, 
    public authService: AuthService,
    private translate: TranslateService
  ) {}

  isMobile = false;

  private updateIsMobile() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.isMobile = window.matchMedia('(max-width: 1100px)').matches;
    }
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  onResize() {
    this.updateIsMobile();
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
      this.router.navigate(['/profile']);
    }

    // A modal fordítása.
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateTranslations();
      });

    // Az események és azok résztvevőinek lekérdezése az esemény id-je alapján.
    this.eventClient.getEventById(this.event.id).subscribe((response) => {
      // JSON formátumba konvertálni a választ.
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string)

        //console.log(jsonData)

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
    this.editEventService.setEvent(this.event);
    this.router.navigate(['/editSheet']);
  }

  onValidateQr() {
    this.eventClient.validateQr(this.event.id).subscribe({
      next: () => {
        console.log('QR validálva!')
        this.event.isQrValid = true
      },
      error: err => console.error('Hiba történt:', err.message)
    })
  }

  onInvalidateQr() {
    this.eventClient.invalidateQr(this.event.id).subscribe({
      next: () => {
       console.log('QR invalidálva!')
       this.event.isQrValid = false
      },
      error: err => console.error('Hiba történt:', err.message)
    })
  }

  setIsQrValid(isValid: boolean) {
    this.event.isQrValid = isValid
  }

  onDeleteEvent(): void {
    this.eventClient.deleteEvent(this.event.id).subscribe({
      next: () => {
        console.log('Esemény törölve!')
      },
      error: err => console.error('Hiba történt:', err.message)
    })

    this.router.navigate(['/profile']);
  }

  updateTranslations() {
    this.translate.get('MODAL.WARNING_TITLE').subscribe((res: string) => {
      this.modalTitle = res;
    });

    this.translate.get('MODAL.EVENT_DELETE_CONFIRM_MESSAGE').subscribe((res: string) => {
      this.modalMessage = res;
    });
  }
}
