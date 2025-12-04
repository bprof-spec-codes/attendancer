import { Component } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { TranslationService } from '../services/translation/translation';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class Login {

  loginModel: LoginModel = new LoginModel()
  errorMessage: string = ''
  selectedLanguage: string = 'en';
  availableLanguages: string[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/sheet/abcf9f45-d59d-4229-b13a-28e9a35718ca']);
    }
  }

   ngOnInit(): void {
    this.translationService.init();

    this.selectedLanguage = this.translationService.getCurrentLanguage();
    this.availableLanguages = this.translationService.getAvailableLanguages();
     console.log(this.selectedLanguage)
  }

  changeLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.selectedLanguage = lang;
  }

  translate(key: string): string {
    return this.translationService.instant(key);
  }

  onLogin(form: NgForm): void {
    this.authService.login(this.loginModel).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = "Invalid email or password. Please try again.";
      }
    });
  }
}
