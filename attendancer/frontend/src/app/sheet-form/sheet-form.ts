import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEventService } from '../services/edit-event-service';
import { EventClient, EventCreateDto, EventGroupClient, EventUpdateDto } from '../app.api-client.generated';
import { EventViewDto } from '../models/event-view-dto';
import { JwtDecodeService } from '../services/jwt-decode.service';
import { EventGroupViewDto } from '../models/event-group-view-dto';
import { SheetService } from '../services/sheet.service';

@Component({
  selector: 'app-sheet-form',
  standalone: false,
  templateUrl: './sheet-form.html',
  styleUrl: './sheet-form.sass',
})
export class SheetForm implements OnInit {
  customFields: number[] = []
  selectedEventOrEventGroup: string = ""
  currentEvent: EventUpdateDto = new EventUpdateDto()
  events: EventViewDto[] = []
  eventGroups: EventGroupViewDto[] = []
  currentlySelectedMetadata: string[] = []
  editMode: boolean = false
  public userId: string | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private eventClient: EventClient, 
    private eventGroupClient: EventGroupClient, 
    private editEventService: EditEventService, 
    private jwtDecodeService: JwtDecodeService,
    private sheetService: SheetService
  ) {}

  ngOnInit(): void {
    // A bejelentkezett felhasználó userId-jének megszerzése.
    this.userId = this.jwtDecodeService.getUserId();
    this.currentEvent.userId = this.userId ?? ""

    if (this.route.snapshot.routeConfig?.path === "editSheet") {

      this.editMode = true

      this.currentEvent = this.editEventService.getEvent();

      if (this.currentEvent === undefined) {
        this.router.navigate(['/createSheet']);
      }

      this.currentEvent.metadata!.forEach(() => {
        this.addCustomField()
      });

      this.selectedEventOrEventGroup = this.currentEvent.eventGroupId ?? ""
      this.onSelectionChange(this.currentEvent.eventGroupId!)
    }

    // Leellenőrizni, hogy ne legyen undefined a metadata.
    if (this.currentEvent.metadata === undefined) {
      this.currentEvent.metadata = []
    }

    // Események melyek nincsenek eseménycsoportba.
    this.eventClient.getEventsByUserId().subscribe((response) => {
      const reader = new FileReader()
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string)
        //console.log(jsonData)

        this.events = jsonData
      };
      reader.readAsText(response.data)
    });

    // Eseménycsoportok a metaadataikkal.
    this.eventGroupClient.getEventGroupsByUserId().subscribe((response) => {
      const reader = new FileReader()
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string)
        //console.log(jsonData)

        this.eventGroups = jsonData

        // Beállítani a metadata-t.
        for (let i = 0; i < this.eventGroups.length; i++) {
          for (let j = 0; j < this.eventGroups[i].events[0].metadata.length; j++) {
            this.eventGroups[i].metadata.push(this.eventGroups[i].events[0].metadata[j])
          }
        }
      }
      reader.readAsText(response.data)
    })
  }

  onSelectionChange(selectedValue: string) {
    if (!this.editMode) {
      this.currentEvent.eventGroupId = selectedValue
    }

    this.events.forEach(event => {
      if (event.id === selectedValue) {
        this.currentlySelectedMetadata = event.metadata
      }
    });

    this.eventGroups.forEach(eventGroup => {
      if (eventGroup.id === selectedValue) {
        this.currentlySelectedMetadata = eventGroup.metadata
      }
    });
  }

  createSheet() {
    if (!this.inputInvalid()) {

      this.currentEvent.metadata = this.currentEvent.metadata!.filter(data => data !== undefined && data !== '')

      //console.log(this.currentEvent)

      //this.eventClient.createEvent(this.currentEvent)

      // Elkészíteni az esemény is visszakapni annak id-jét.
      this.sheetService.postSheet(this.currentEvent).subscribe({
        next: (response: string) => {
          console.log("The created event's id: ", Object.values(response)[0]);
        },
        error: (err) => {
          console.error("Error occurred: ", err);
        },
      });

      this.resetPage()
    }
  }

  editSheet() {
    if (!this.inputInvalid()) {

      this.currentEvent.metadata = this.currentEvent.metadata!.filter(data => data !== undefined && data !== '')

      this.currentEvent.eventGroupId = this.selectedEventOrEventGroup

      //this.eventClient.updateEvent(this.currentEvent.id!, this.currentEvent)
      this.router.navigate(['/profile']);
    }
  }

  inputInvalid(): boolean {
    return !(this.currentEvent.name && this.currentEvent.date)
  }

  resetPage(): void {
    this.customFields = []
    this.selectedEventOrEventGroup = ""
    this.currentEvent = new EventCreateDto()
    this.events = []
    this.eventGroups = []
    this.currentlySelectedMetadata = []
    this.ngOnInit()
  }

  addCustomField(): void {
    this.customFields.push(this.customFields.length);
  }

  removeCustomField(index: number): void {
    this.customFields.splice(index, 1);
    this.currentEvent.metadata![index] = ""
  }
}
