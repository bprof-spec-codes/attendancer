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
  successMessage: string = '';
  isLoading: boolean = false;


  constructor(
    public authService: AuthService,
    private router: Router
  ){
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/sheet']);
    }
  }

  onRegister(): void {
      // Input validáció
      const validationError = this.validateInputs();
      if (validationError) {
        this.errorMessage = validationError;
        return;
      }

      this.errorMessage = '';
      this.isLoading = true;

      // AuthService register meghívása
      this.authService.register(this.registerModel);

      // Várakozás a token localStorage-ba kerülésére
      setTimeout(() => {
        if (this.authService.isLoggedIn()) {
          console.log('Regisztráció sikeres!');
          this.successMessage = 'Sikeres regisztráció! Átirányítás...';

          // Redirect a főoldalra
          setTimeout(() => {
            this.router.navigate(['/sheet']);
          }, 1000);
        } else {
          this.errorMessage = 'Hiba a regisztráció során! Próbáld újra.';
          this.isLoading = false;
        }
      }, 500);
    }
private validateInputs(): string | null {
    // Keresztnév ellenőrzés
    if (!this.registerModel.firstName.trim()) {
      return 'Keresztnév megadása kötelező!';
    }
    if (this.registerModel.firstName.trim().length < 2) {
      return 'A keresztnévnek legalább 2 karakter hosszúnak kell lennie!';
    }

    // Vezetéknév ellenőrzés
    if (!this.registerModel.lastName.trim()) {
      return 'Vezetéknév megadása kötelező!';
    }
    if (this.registerModel.lastName.trim().length < 2) {
      return 'A vezetéknévnek legalább 2 karakter hosszúnak kell lennie!';
    }

    // Email ellenőrzés
    if (!this.registerModel.email.trim()) {
      return 'Email cím megadása kötelező!';
    }
    if (!this.isValidEmail(this.registerModel.email)) {
      return 'Érvénytelen email formátum!';
    }

    // Jelszó ellenőrzés
    if (!this.registerModel.password) {
      return 'Jelszó megadása kötelező!';
    }
    if (this.registerModel.password.length < 6) {
      return 'A jelszónak legalább 6 karakter hosszúnak kell lennie!';
    }

    // Jelszó megerősítés ellenőrzés
    if (!this.confirmPassword) {
      return 'Jelszó megerősítése kötelező!';
    }
    if (this.registerModel.password !== this.confirmPassword) {
      return 'A két jelszó nem egyezik!';
    }

    return null; // Minden rendben
  }


 private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

 inputCheck(): boolean {
    return this.registerModel.firstName.length > 0 &&
           this.registerModel.lastName.length > 0 &&
           this.registerModel.email.length > 0 &&
           this.registerModel.password.length >= 6 &&
           this.confirmPassword.length >= 6;
  }
}
