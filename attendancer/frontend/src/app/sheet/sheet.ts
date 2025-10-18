import { Component } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';

@Component({
  selector: 'app-sheet',
  standalone: false,
  templateUrl: './sheet.html',
  styleUrl: './sheet.sass'
})
export class Sheet {
  event: any
  participants: any
  presentCount: number = 0
  absentCount: number = 0

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.mockDataService.getEventById().subscribe((data) => {
      this.event = data;
    });
    this.mockDataService.getParticipantsByEventId().subscribe((data) => {
      this.participants = data;
    });
    this.countPresent()
  }

  countPresent(): void {
    for (let i = 0; i < this.participants.length; i++) {
      if (this.participants[i].present) {
        this.presentCount++
      }
    }

    this.absentCount = this.participants.length - this.presentCount
  }
}
