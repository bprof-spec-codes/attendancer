import { Component, HostListener, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { EventGroupClient } from '../app.api-client.generated';
import { NgForm } from '@angular/forms';
import { UserClient } from '../app.api-client.generated';
import {
  EventGroupDto,
  EventGroupMatrixViewDto,
  StatisticsService,
} from '../services/statistics-service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SignedEvents } from '../models/signed-events';
import { EventViewDto } from '../models/event-view-dto';
import { EventGroupViewDto } from '../models/event-group-view-dto';
import { SheetService } from '../services/sheet.service';
import { EditEventService } from '../services/edit-event-service';

@Component({
  selector: 'app-sheets-section',
  standalone: false,
  templateUrl: './sheets-section.html',
  styleUrl: './sheets-section.sass',
})
export class SheetsSection implements OnInit, OnDestroy {
  isMobile = false;
  userEvents: EventViewDto[] = [];
  eventGroups: EventGroupDto[] = [];
  eventGroupView: EventGroupViewDto[] = [];
  allEventsInGroup: EventViewDto[] = [];
  modalTitle: string = '';
  modalMessage: string = '';
  @Input() user!: User;
  selectedEvent: EventViewDto | null = null;
  isSheetModalOpen = false;
  modalMode: 'view' | 'edit' = 'view';

  constructor(
    private router: Router,
    private userService: UserClient,
    private customUserService: UserService,
    private translate: TranslateService,
    private eventGroupClient: EventGroupClient,
    private statisticsService: StatisticsService,
    private eventService: SheetService,
    private editEventService: EditEventService
  ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    this.loadUserEvents();
    this.loadEventGroups();

  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
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

  loadUserEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data: EventViewDto[]) => {
        this.userEvents = data || [];
      },
      error: (err) => {
        this.userEvents = [];
      },
    });
  }

  loadEventGroups(): void {
    this.eventGroupClient.getEventGroupsByUserId().subscribe((response) => {
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string);
        console.log(jsonData);

        this.eventGroupView = jsonData;

        this.eventGroupView.forEach((group) => {
          this.eventService.getEventsByGroupId(group.id).subscribe({
            next: (events: EventViewDto[]) => {
              group.events = events || [];
            },
            error: (err) => {
              console.error('Error while loading in events', err);
              group.events = [];
            }
          });
        });
      };
      reader.readAsText(response.data);
    });
  }



  onDeleteSheet(id: string) {
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/profile']);
        });
      },
      error: (err) => {
        console.error('Hiba a lap törlésekor', err);
      },
    });
  }

  onDeleteGroup(id: string) {
    this.eventService.deleteEventGroup(id).subscribe({
      next: () => {
        this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/profile']);
        });
      },
      error: (err) => {
        console.error('Hiba a torleskor', err);
      }
    })
  }


  onEditSheet(sheet: EventViewDto) {
    this.editEventService.setEvent(sheet);

    this.router.navigate(['/editSheet']);
  }
  updateTranslations() {
    this.translate.get('MODAL.WARNING_TITLE').subscribe((res: string) => {
      this.modalTitle = res;
    });

    this.translate.get('MODAL.ACCOUNT_DELETE_CONFIRM_MESSAGE').subscribe((res: string) => {
      this.modalMessage = res;
    });
  }

  viewEvent(id: string) {
    this.router.navigate([`/sheet/${id}`])
  }

  openSheetModal(event: EventViewDto, mode: 'view' | 'edit') {
    this.selectedEvent = event;
    this.modalMode = mode;
    this.isSheetModalOpen = true;
  }

  closeSheetModal() {
    this.isSheetModalOpen = false;
    this.selectedEvent = null;
  }
}
