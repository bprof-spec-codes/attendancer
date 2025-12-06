import { Component, HostListener, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { NgForm } from '@angular/forms';
import { EventGroupDto, EventGroupMatrixViewDto, StatisticsService } from '../services/statistics-service';

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
  participation: any[] = [
    // mock-olása
    {
      name: '',
      lastSigned: '',
      signedEvents: [],
    },
  ];
  user: User = new User();

  eventGroups: EventGroupDto[] = [];
  selectedEventGroupId: string = '';
  matrix: EventGroupMatrixViewDto | null = null;

  userId: string = (Math.floor(Math.random() * 3) + 1).toString(); // a bejelentkezett felhasználó id-jének mock-olása

  nameErrorMessage: string = '';
  emailErrorMessage: string = '';
  emailConfirmErrorMessage: string = '';
  passwordErrorMessage: string = '';
  passwordConfirmErrorMessage: string = '';

  constructor(private mockDataService: MockDataService, private userService: UserService,private statisticsService: StatisticsService) {}

  pendingFirstName: string = '';
  pendingLastName: string = '';
  pendingEmail: string = '';
  pendingEmailConfirm: string = '';

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((data) => {
      this.user = data;
    });

    this.loadEventGroups();

    this.mockDataService.getSignedEventsByUserId(this.userId).subscribe((data) => {
      this.participation = data;
    });
  }

  loadEventGroups(): void {
    this.statisticsService.getMyEventGroups().subscribe({
      next: (data: EventGroupDto[]) => {
        this.eventGroups = data || [];
      },
      error: (err) => {
        console.error('Hiba az eseménycsoportok betöltésekor', err);
        this.eventGroups = [];
      }
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
    this.userService.updateUser(this.user).subscribe({
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
    this.userService.updateUser(this.user).subscribe({
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
      newPassword: form.value.password
    };

    this.userService.updatePassword(passwordData as any).subscribe({
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
    this.userService.deleteAccount().subscribe({
      next: () => {
        localStorage.removeItem('attendancer-jwt-token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Hiba történt a fiók törlése során.');
      }
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
