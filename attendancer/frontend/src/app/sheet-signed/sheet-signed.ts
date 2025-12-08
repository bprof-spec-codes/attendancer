import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventViewDto } from '../models/event-view-dto';
import { EventClient, FileResponse, ParticipantClient, ParticipantCreateDto} from '../app.api-client.generated';
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
  isSigned: boolean = false

  
  constructor(private route:ActivatedRoute, private router:Router, private eventService: EventClient, private userService: UserService, private participantService: ParticipantClient) {}

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
  const dto = new ParticipantCreateDto();
  dto.eventId = this.eventId;
  dto.userId = this.user.id;
  dto.metadata = JSON.stringify(this.dataConverter());

  this.participantService.createParticipant(dto).subscribe({
    next: (res: FileResponse) => {
      if (res.data) {
        res.data.text().then(text => {
          if (text) {
            try {
              const created = JSON.parse(text);
            } catch (err) {
              console.error("Error parsing response text:", err);
            }
          } 
           //this.router.navigate(['/profile'])
           this.isSigned = true;
        });
      }
    },
    error: err => {
      console.error("Error creating participant:", err);
      console.log("DTO that will be sent:", dto);
    }
  });}

  eventIsSigned(): boolean {
    return this.event.participants?.some(p => p.userFullName === this.user.lastName + ' ' +  this.user.firstName) || false
  }
}
