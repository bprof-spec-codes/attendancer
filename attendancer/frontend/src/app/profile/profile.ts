import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { NgForm } from '@angular/forms';
import { UserClient } from '../app.api-client.generated';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
  participation: any[] = []
  user: User = new User();

  userId: string = (Math.floor(Math.random() * 3) + 1).toString(); // a bejelentkezett felhasználó id-jének mock-olása

  nameErrorMessage: string = '';
  emailErrorMessage: string = '';
  emailConfirmErrorMessage: string = '';
  passwordErrorMessage: string = '';
  passwordConfirmErrorMessage: string = '';

  constructor(
    private router: Router,
    private userService: UserClient,
    private customUserService: UserService,
    private translate: TranslateService
  ) {}

  pendingFirstName: string = '';
  pendingLastName: string = '';
  pendingEmail: string = '';
  pendingEmailConfirm: string = '';

  modalTitle: string = ""
  modalMessage: string = ""
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // A modal fordítás.
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.updateTranslations();
      });

    this.customUserService.getCurrentUser().subscribe((data) => {
      this.user = data;
    });

    this.userService.getMySignedSheets().subscribe((response) => {
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string);
        console.log(jsonData)

        // TODO, más adat kell

        this.participation = jsonData;
      };
      reader.readAsText(response.data);
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
      newPassword: password,
    };

    this.customUserService.updatePassword(this.user.id, passwordData).subscribe({
      next: (response: any) => {
        console.log('Password updated successfully', response);
        form.resetForm();
      },
      error: (err) => {
        console.error('Error updating password', err);
        this.passwordErrorMessage = 'Error updating password. Please try again.';
      },
    });
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
      }
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
