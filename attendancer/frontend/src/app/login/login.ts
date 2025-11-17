import { Component } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class Login {

  loginModel: LoginModel = new LoginModel()
  errorMessage: string = ''

  constructor(
    public authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/sheet/1']);
    }
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang && ['en','hu','de'].includes(browserLang) ? browserLang : 'en');
  }

  onLogin(form: NgForm): void {
    this.authService.login(this.loginModel).subscribe({
      next: () => {
        this.router.navigate(['/sheet/1']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = "Invalid email or password. Please try again.";
      }
    });
  }
}
