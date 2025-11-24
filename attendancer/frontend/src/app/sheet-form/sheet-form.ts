import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEventService } from '../services/edit-event-service';

@Component({
  selector: 'app-sheet-form',
  standalone: false,
  templateUrl: './sheet-form.html',
  styleUrl: './sheet-form.sass',
})
export class SheetForm implements OnInit {
  customFields: number[] = []
  selectedEventOrEventGroup: string = ""
  currentEvent: any = {
    id: "",
    name: "",
    date: "",
    eventGroupId: "",
    metadata: []
  }
  events: any[] = []
  eventGroups: any[] = []
  currentlySelectedMetadata: string[] = []
  userId: string = (Math.floor(Math.random() * 3) + 1).toString()
  editMode: boolean = false

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private mockDataService: MockDataService, 
    private editEventService: EditEventService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path === "editSheet") {

      this.editMode = true

      this.currentEvent = this.editEventService.getEvent();

      if (this.currentEvent === undefined) {
        this.router.navigate(['/createSheet']);
      }

      this.currentEvent.metadata.forEach(() => {
        this.addCustomField()
      });

      this.selectedEventOrEventGroup = this.currentEvent.eventGroupId
      this.onSelectionChange(this.currentEvent.eventGroupId)
    }
    
    this.mockDataService.getEventsByUserId(this.userId).subscribe((data) => {
      this.events = data;
    });

    this.mockDataService.getEventGroupsWithMetadataByUserId(this.userId).subscribe((data) => {
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

      this.currentEvent.metadata = this.currentEvent.metadata.filter((data: undefined) => data !== undefined && data !== '')

      this.mockDataService.postEvent(this.currentEvent)
      this.resetPage()
    }
  }


  editSheet() {
    if (!this.inputInvalid()) {

      this.currentEvent.metadata = this.currentEvent.metadata.filter((data: undefined) => data !== undefined && data !== '')

      this.currentEvent.eventGroupId = this.selectedEventOrEventGroup

      this.mockDataService.updateEvent(this.currentEvent)
      this.router.navigate(['/profile']);
    }
  }

  inputInvalid(): boolean {
    return !(this.currentEvent.name.length > 0 && this.currentEvent.date.length > 0)
  }

  resetPage(): void {
    this.customFields = []
    this.selectedEventOrEventGroup = ""
    this.currentEvent = {
      name: "",
      eventGroupId: "",
      date: "",
      metadata: []
    }
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
    this.currentEvent.metadata[index] = ""
  }
}
