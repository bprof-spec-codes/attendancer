import { Component } from '@angular/core';
import { LoginModel } from '../models/login-model';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
      this.router.navigate(['/sheet/abcf9f45-d59d-4229-b13a-28e9a35718ca']);
    }
  }

  onLogin(form: NgForm): void {
    this.authService.login(this.loginModel).subscribe({
      next: () => {
        this.router.navigate(['/sheet/abcf9f45-d59d-4229-b13a-28e9a35718ca']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = "Invalid email or password. Please try again.";
      }
    });
  }
}
