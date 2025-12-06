import { Component, OnInit, HostListener } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { EditEventService } from '../services/edit-event-service';

@Component({
  selector: 'app-sheet',
  standalone: false,
  templateUrl: './sheet.html',
  styleUrls: ['./sheet.sass']
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
    public authService: AuthService
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
}
