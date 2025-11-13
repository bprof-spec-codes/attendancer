import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.sass'
})
export class Profile {
  constructor(public authService:AuthService) {}
  activeSection: 'profile' | 'statistics' | 'edit' | 'sheets' = 'profile';

  setActiveSection(section: 'profile'|'statistics'| 'edit' |'sheets'): void{
    this.activeSection = section;
  }
}
