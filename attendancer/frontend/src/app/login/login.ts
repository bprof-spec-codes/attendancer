import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.sass'
})
export class Login {

  loginModel: LoginModel = new LoginModel()
  errorMessage: string = ''
  returnUrl: string = ''
  isLoading: boolean = false

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/sheet']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/sheet';
  }

 onLogin(): void {
    if (!this.inputCheck()) {
      this.errorMessage = 'Email és jelszó megadása kötelező!';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginModel);

    setTimeout(() => {
      if (this.authService.isLoggedIn()) {
        console.log('Login sikeres, navigálás:', this.returnUrl);
        this.router.navigate([this.returnUrl]);
      } else {
        this.errorMessage = 'Invalid email or password!';
        this.isLoading = false;
      }
    }, 500);
  }
 inputCheck(): boolean {
  const emailValid = this.loginModel.email.length > 0 &&
                     this.isValidEmail(this.loginModel.email);
  const passwordValid = this.loginModel.password.length > 0;
  return emailValid && passwordValid;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

}
