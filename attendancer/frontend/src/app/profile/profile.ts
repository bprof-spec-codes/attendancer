import { Component, HostListener, OnInit } from '@angular/core';
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
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.sass',
})
export class Profile implements OnInit {
  activeSection: 'profile' | 'statistics' | 'edit' | 'sheets' = 'profile';
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
  signedEvents: SignedEvents[][] = [];
  signedEventGroupName: string = '';
  user: User = new User();

  eventGroups: EventGroupDto[] = [];
  selectedEventGroupId: string = '';
  matrix: EventGroupMatrixViewDto | null = null;

  userEvents: EventViewDto[] = [];

  nameErrorMessage: string = '';
  emailErrorMessage: string = '';
  emailConfirmErrorMessage: string = '';
  passwordErrorMessage: string = '';
  passwordConfirmErrorMessage: string = '';

  pendingFirstName: string = '';
  pendingLastName: string = '';
  pendingEmail: string = '';
  pendingEmailConfirm: string = '';

  modalTitle: string = '';
  modalMessage: string = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserClient,
    private customUserService: UserService,
    private translate: TranslateService,
    private statisticsService: StatisticsService,
    private eventService: SheetService,
    private editEventService: EditEventService
  ) {}

  ngOnInit(): void {
    // A modal fordítása.
    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.updateTranslations();
    });

    this.customUserService.getCurrentUser().subscribe((data) => {
      this.user = data;
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

    this.loadEventGroups();
    this.loadUserEvents();
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

  onEditSheet(sheet: EventViewDto) {
    this.editEventService.setEvent(sheet);

    this.router.navigate(['/editSheet']);
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

  setActiveSection(section: 'profile' | 'statistics' | 'edit' | 'sheets'): void {
    this.activeSection = section;
  }

  onChangeName(form: NgForm): void {
    this.nameErrorMessage = '';
    if (form.invalid) {
      this.nameErrorMessage = 'Please fill in all required fields';
      return;
    }
    this.user.firstName = this.pendingFirstName;
    this.user.lastName = this.pendingLastName;
    this.customUserService.updateUser(this.user).subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: () => {
        this.nameErrorMessage = 'Error updating name. Please try again.';
      },
    });
    form.resetForm();
  }

  onChangeEmail(form: NgForm): void {
    this.emailErrorMessage = '';
    this.emailConfirmErrorMessage = '';
    if (form.invalid) {
      this.emailErrorMessage = 'Please fill in all required fields';
      return;
    }
    if (this.pendingEmail !== this.pendingEmailConfirm) {
      this.emailConfirmErrorMessage = 'Emails do not match';
      return;
    }
    this.user.email = this.pendingEmail;
    this.customUserService.updateUser(this.user).subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: () => {
        this.emailErrorMessage = 'Error updating email. Please try again.';
      },
    });
    form.resetForm();
  }

  onChangePassword(form: NgForm): void {
    this.passwordErrorMessage = '';
    this.passwordConfirmErrorMessage = '';

    if (form.invalid) {
      this.passwordErrorMessage = 'Please fill in all required fields';
      return;
    }
    const password = form.value.password;
    const passwordConfirm = form.value.passwordConfirm;

    if (password !== passwordConfirm) {
      this.passwordConfirmErrorMessage = 'Passwords do not match';
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      this.passwordErrorMessage =
        'Password must be at least 6 characters with uppercase, lowercase, and number';
      return;
    }
    const passwordData = {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.password,
    };

    //this.customUserService.updatePassword(this.user.id, passwordData).subscribe({
    this.userService.changePassword(passwordData as any).subscribe({
      next: (response: any) => {
        console.log('Password updated successfully', response);
      },
      error: (err) => {
        console.error('Error updating password', err);
        this.passwordErrorMessage = 'Error updating password. Please try again.';
      },
    });
    form.resetForm();
  }
  onDeleteAccount(): void {
    this.userService.deleteUser().subscribe({
      next: () => {
        localStorage.removeItem('attendancer-jwt-token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Hiba történt a fiók törlése során.');
      },
    });
  }

  /**
   * A modal-hoz átadni a megfelelő nyelvű üzeneteket.
   */
  updateTranslations() {
    this.translate.get('MODAL.WARNING_TITLE').subscribe((res: string) => {
      this.modalTitle = res;
    });

    this.translate.get('MODAL.ACCOUNT_DELETE_CONFIRM_MESSAGE').subscribe((res: string) => {
      this.modalMessage = res;
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
}
