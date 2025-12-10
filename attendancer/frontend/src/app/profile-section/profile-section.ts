import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { UserClient } from '../app.api-client.generated';
import {
  StatisticsService,
} from '../services/statistics-service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SignedEvents } from '../models/signed-events';
import { SheetService } from '../services/sheet.service';
import { EditEventService } from '../services/edit-event-service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-profile-section',
  standalone: false,
  templateUrl: './profile-section.html',
  styleUrl: './profile-section.sass',
})
export class ProfileSection implements OnInit, OnDestroy{


  isMobile = false;
  signedEvents: SignedEvents[][] = [];
  signedEventGroupName: string = '';
  modalTitle: string = '';
  modalMessage: string = '';
  private unsubscribe$ = new Subject<void>();
  @Input() user!: User;

  activeSection: 'profile' | 'statistics' | 'edit' | 'sheets' = 'profile';

  constructor(
    private router: Router,
    private userService: UserClient,
    private customUserService: UserService,
    private translate: TranslateService,
    private statisticsService: StatisticsService,
    private eventService: SheetService,
    private editEventService: EditEventService
  ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateTranslations();
    });
    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateTranslations();
    });
    this.userService.getMySignedSheets().subscribe((response) => {
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string) as any[];

        // Az eventGroupId szerint csoportosítani az eseményeket ami lehet null érték is.
        const groupedEvents = jsonData.reduce((acc, event) => {
          const groupId = event.eventGroupId || '';
          if (!acc[groupId]) {
            acc[groupId] = [];
          }
          acc[groupId].push(event);
          return acc;
        }, {});

        this.signedEvents = Object.values(groupedEvents);

        for (let i = 0; i < this.signedEvents.length; i++) {
          for (let j = 0; j < this.signedEvents[i].length; j++) {
            let eventDate = new Date(this.signedEvents[i][j].eventDate).getTime();
            let signedAtDate = new Date(this.signedEvents[i][j].signedAt).getTime();
            const diffMilliseconds = eventDate - signedAtDate;

            // Ha 24 órán belül van akkor igaz (86400000 milliseconds).
            if (diffMilliseconds >= 0 && diffMilliseconds <= 86400000) {
              this.signedEvents[i][j].inTime = true;
            } else {
              this.signedEvents[i][j].inTime = false;
            }
          }
        }
      };
      reader.readAsText(response.data);
    });
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  onUserChanged(updatedUser: User) {
  this.user = updatedUser;
}

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  updateTranslations() {
    this.translate.get('MODAL.WARNING_TITLE').subscribe((res: string) => {
      this.modalTitle = res;
    });

    this.translate.get('MODAL.ACCOUNT_DELETE_CONFIRM_MESSAGE').subscribe((res: string) => {
      this.modalMessage = res;
    });
  }

  setActiveSection(section: 'profile' | 'statistics' | 'edit' | 'sheets'): void {
    this.activeSection = section;
  }

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
}
