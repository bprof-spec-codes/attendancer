import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegisterModel } from '../models/register-model';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.html',
  styleUrl: './registration.sass'
})
export class Registration {

  registerModel: RegisterModel = new RegisterModel()
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ){
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  onRegister(): void {
      if (!this.registerModel.email || !this.registerModel.password) {
        this.errorMessage = "Email and password are required!";
        return;
      }
      if (this.registerModel.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }
      this.errorMessage = '';

      this.authService.register(this.registerModel).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.errorMessage = "Registration failed. Please try again!"
      });
    }

 inputCheck(): boolean {
    return this.registerModel.firstName.length > 0 &&
           this.registerModel.lastName.length > 0 &&
           this.registerModel.email.length > 0 &&
           this.registerModel.password.length >= 6 &&
           this.confirmPassword.length >= 6 &&
           this.registerModel.password === this.confirmPassword;
  }
}
