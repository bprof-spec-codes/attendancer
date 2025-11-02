import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

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
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }

  }

 onLogin(): void {
    if (this.authService.isLoggedIn()) {
       this.router.navigate(['/profile']);
    } else {
      this.errorMessage = "Invalid email or password";
    }

    this.authService.login(this.loginModel);

    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/profile']);
      } else {
        this.errorMessage = "Invalid email or password. Please try again.";
      }
  }, 1000);
  }
 inputCheck(): boolean {
  const emailValid = this.loginModel.email.length > 0;
  const passwordValid = this.loginModel.password.length > 0;
  return emailValid && passwordValid;
  }
}
