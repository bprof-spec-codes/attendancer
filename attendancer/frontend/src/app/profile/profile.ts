import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.sass'
})
export class Profile implements OnInit {
  activeSection: 'profile' | 'statistics' | 'sheets' = 'profile';
  participation: any[] = [ // mock-olása
    {
      "name": "",
      "lastSigned": "",
      "signedEvents": []
    }
  ]
  user: any = { // egy User mock-olása - itt majd ez lesz: user: User
    lastName: "",
    firstName: "",
    email: ""
  }
  userId: string = (Math.floor(Math.random() * 3) + 1).toString() // a bejelentkezett felhasználó id-jének mock-olása

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.mockDataService.getUserByUserId(this.userId).subscribe((data) => {
      this.user = data;
    });

    this.mockDataService.getSignedEventsByUserId(this.userId).subscribe((data) => {
      this.participation = data;
    });
  }

  setActiveSection(section: 'profile' | 'statistics' | 'sheets'): void {
    this.activeSection = section;
  }
}
