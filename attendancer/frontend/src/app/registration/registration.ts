import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, ValidationErrors, NgForm } from '@angular/forms';
import { RegisterModel } from '../models/register-model';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.html',
  styleUrl: './registration.sass',
})
export class Registration {
  registerModel: RegisterModel = new RegisterModel();
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/sheet/1']);
    }
  }

  onRegister(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.errorMessage = '';

    this.authService.register(this.registerModel).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => (this.errorMessage = 'Registration failed. Please try again!'),
    });
  }
}
