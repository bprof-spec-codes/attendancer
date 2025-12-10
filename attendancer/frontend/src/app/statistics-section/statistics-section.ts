import { Component, HostListener, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
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
import { SheetService } from '../services/sheet.service';
import { EditEventService } from '../services/edit-event-service';

@Component({
  selector: 'app-statistics-section',
  standalone: false,
  templateUrl: './statistics-section.html',
  styleUrl: './statistics-section.sass',
})
export class StatisticsSection implements OnInit, OnDestroy {
  matrix: EventGroupMatrixViewDto | null = null;
  selectedEventGroupId: string = '';
  eventGroups: EventGroupDto[] = [];
  userEvents: EventViewDto[] = [];
  isMobile = false;
  @Input() user!: User;
  modalTitle: string = '';
  modalMessage: string = '';


  constructor(
    private router: Router,
    private userService: UserClient,
    private customUserService: UserService,
    private translate: TranslateService,
    private statisticsService: StatisticsService,
    private eventService: SheetService,
    private editEventService: EditEventService
  ) { }

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

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
    this.loadEventGroups();
    this.loadUserEvents();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  loadEventGroups(): void {
    this.statisticsService.getMyEventGroups().subscribe({
      next: (data: EventGroupDto[]) => {
        this.eventGroups = data || [];
      },
      error: (err) => {
        console.error('Hiba az eseménycsoportok betöltésekor', err);
        this.eventGroups = [];
      },
    });
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
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
  onEventGroupChange(): void {
    if (!this.selectedEventGroupId) {
      this.matrix = null;
      return;
    }

    this.statisticsService.getEventGroupMatrix(this.selectedEventGroupId).subscribe({
      next: (matrix) => {
        this.matrix = matrix;
      },
      error: (err) => {
        console.error('Hiba a mátrix betöltésekor', err);
      },
    });
  }

  updateTranslations() {
    this.translate.get('MODAL.WARNING_TITLE').subscribe((res: string) => {
      this.modalTitle = res;
    });

    this.translate.get('MODAL.ACCOUNT_DELETE_CONFIRM_MESSAGE').subscribe((res: string) => {
      this.modalMessage = res;
    });
  }


}
