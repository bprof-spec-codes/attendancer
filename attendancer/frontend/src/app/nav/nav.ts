import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrl: './nav.sass'
})
export class Nav {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout()
  }
}
