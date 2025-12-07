import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventViewDto } from '../models/event-view-dto';
import { EventClient, ParticipantClient, ParticipantCreateDto} from '../app.api-client.generated';
import { UserService } from '../services/user-service';
import { User } from '../models/user';

@Component({
  selector: 'app-sheet-signed',
  standalone: false,
  templateUrl: './sheet-signed.html',
  styleUrls: ['./sheet-signed.sass']
})
export class SheetSigned implements OnInit {
  metadataCount: number = 0
  metadataNames: string[] = []
  event: EventViewDto = new EventViewDto()
  eventId: string = ""
  user: User = new User()
  metadata: string[] = [];

  
  constructor(private route:ActivatedRoute, private eventService: EventClient, private userService: UserService, private participantService: ParticipantClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id']
    })
    this.loadEvent(this.eventId)
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user
      }
    })
    console.log("Event ID:", this.eventId)
  }

  loadEvent(eventId: string) {
     this.eventService.getEventById(eventId).subscribe({
    next: (response) => {
      response.data.text().then(text => {
        if (!text) return
        this.event = JSON.parse(text)
        this.metadataCount = this.event.metadata?.length || 0
        this.metadataNames = this.event.metadata || []  
      })
    },
    error: (err) => {
      console.error("Error loading event:", err)
    }
  })
  }

  dataConverter(): string{
    const metadataObject: any = {}
    this.metadataNames.forEach((name, index) => {
      const value = this.metadata[index]
      if (name && value) {
        metadataObject[name] = value
      }
    });
    return metadataObject
  }

  SignInEvent() {
    const dto = new ParticipantCreateDto()
    console.log("Current user:", this.user)
    dto.userId = this.user.id
    dto.eventId = this.eventId
    dto.metadata = this.dataConverter();
    this.participantService.createParticipant(this.eventId, dto).subscribe(res => {
      res.data.text().then(text => {
        if (text) {
          const created = JSON.parse(text)
          console.log("Participant created:", created)
        }
      })
    })
    console.log("Jelenléti ív aláírva!")
    console.log("Current userId:", dto.userId)
    console.log("Event ID:", dto.eventId)
    console.log("Metadata:", dto.metadata)
  }
  eventIsSigned(): boolean {
    return this.event.participants?.some(p => p.userFullName === this.user.lastName + ' ' +  this.user.firstName) || false
  }
}
