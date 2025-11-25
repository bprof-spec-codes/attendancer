import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEventService } from '../services/edit-event-service';
import { EventClient, EventCreateDto } from '../app.api-client.generated';
import { EventViewDto } from '../models/event-view-dto';
import { JwtDecodeService } from '../services/jwt-decode.service';

@Component({
  selector: 'app-sheet-form',
  standalone: false,
  templateUrl: './sheet-form.html',
  styleUrl: './sheet-form.sass',
})
export class SheetForm implements OnInit {
  customFields: number[] = []
  selectedEventOrEventGroup: string | undefined = ""
  currentEvent: EventCreateDto = new EventCreateDto()
  events: EventViewDto[] = []
  eventGroups: any[] = []
  currentlySelectedMetadata: string[] = []
  editMode: boolean = false
  public userId: string | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private eventClient: EventClient, 
    private mockDataService: MockDataService, 
    private editEventService: EditEventService, 
    private jwtDecodeService: JwtDecodeService
  ) {}

  ngOnInit(): void {
    // A bejelentkezett felhasználó userId-jének megszerzése.
    this.userId = this.jwtDecodeService.getUserId();
    this.currentEvent.userId = this.userId ?? ""

    if (this.route.snapshot.routeConfig?.path === "editSheet") {

      this.editMode = true

      this.currentEvent = this.editEventService.getEvent();

      // TODO TEMP
      this.currentEvent.date = new Date("2025-11-25T10:00").toISOString().slice(0, 16)
      // TODO TEMP

      if (this.currentEvent === undefined) {
        this.router.navigate(['/createSheet']);
      }

      this.currentEvent.metadata!.forEach(() => {
        this.addCustomField()
      });

      this.selectedEventOrEventGroup = this.currentEvent.eventGroupId
      this.onSelectionChange(this.currentEvent.eventGroupId!)
    }

    // Leellenőrizni, hogy ne legyen undefined a metadata.
    if (this.currentEvent.metadata === undefined) {
      this.currentEvent.metadata = []
    }

    // Event -> Events ?
    // Mindet visszaadja nem csak a csoport nélkülieket!
    this.eventClient.getEventByUserId().subscribe((response) => {
      const reader = new FileReader();
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string);
        //console.log(jsonData)

        this.events = jsonData;
      };
      reader.readAsText(response.data);
    });

    // TODO
    this.mockDataService.getEventGroupsWithMetadataByUserId(this.userId!).subscribe((data) => {
      this.eventGroups = data;
    });
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

      if (this.currentEvent.eventGroupId === undefined) {
        this.currentEvent.eventGroupId = ""
      }

      //this.mockDataService.postEvent(this.currentEvent)
      console.log(this.currentEvent)
      this.eventClient.createEvent(this.currentEvent)

      this.resetPage()
    }
  }

  editSheet() {
    if (!this.inputInvalid()) {

      this.currentEvent.metadata = this.currentEvent.metadata!.filter(data => data !== undefined && data !== '')

      this.currentEvent.eventGroupId = this.selectedEventOrEventGroup

      //this.mockDataService.updateEvent(this.currentEvent)
      this.eventClient.updateEvent(this.currentEvent.id!, this.currentEvent)
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
    this.userId = (Math.floor(Math.random() * 3) + 1).toString()
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
