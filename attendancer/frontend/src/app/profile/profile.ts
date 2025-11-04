import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.sass'
})
export class Profile {
  activeSection: 'profile' | 'statistics' | 'sheets' = 'profile';

  setActiveSection(section: 'profile'|'statistics'|'sheets'): void{
    this.activeSection = section;
  }
}
