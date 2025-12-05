import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEventService } from '../services/edit-event-service';
import { EventClient, EventCreateDto, EventGroupClient, EventGroupCreateDto, EventUpdateDto } from '../app.api-client.generated';
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
  selectedEventOrEventGroup: string | undefined = undefined
  currentEvent: EventUpdateDto = new EventUpdateDto()
  events: EventViewDto[] = []
  eventGroups: EventGroupViewDto[] = []
  currentlySelectedMetadata: string[] = []
  editMode: boolean = false
  isSelectedEvent: boolean = false
  public userId: string | null = null
  public createEventGroup: EventGroupCreateDto = new EventGroupCreateDto()

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
    this.userId = this.jwtDecodeService.getUserId()
    this.currentEvent.userId = this.userId ?? ""

    this.selectedEventOrEventGroup = undefined

    // Ha szerkesztő oldal.
    if (this.route.snapshot.routeConfig?.path === "editSheet") {

      this.editMode = true

      this.currentEvent = this.editEventService.getEvent()

      if (this.currentEvent === undefined) {
        this.router.navigate(['/createSheet'])
      }

      this.currentEvent.metadata!.forEach(() => {
        this.addCustomField()
      })

      this.selectedEventOrEventGroup = this.currentEvent.eventGroupId ?? undefined
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
      }
      reader.readAsText(response.data)
    })

    // Eseménycsoportok a metaadataikkal.
    this.eventGroupClient.getEventGroupsByUserId().subscribe((response) => {
      const reader = new FileReader()
      reader.onload = () => {
        const jsonData = JSON.parse(reader.result as string)
        //console.log(jsonData)

        this.eventGroups = jsonData
      }
      reader.readAsText(response.data)
    })
  }

  onSelectionChange(selectedValue: string) {
    if (!this.editMode) {
      this.currentEvent.eventGroupId = selectedValue
    }

    if (selectedValue === undefined) {
      this.isSelectedEvent = false
    }

    this.events.forEach(event => {
      if (event.id === selectedValue) {
        this.currentlySelectedMetadata = event.metadata
        this.currentEvent.metadata = this.currentlySelectedMetadata
        this.isSelectedEvent = true
      }
    })

    this.eventGroups.forEach(eventGroup => {
      if (eventGroup.id === selectedValue) {
        this.currentlySelectedMetadata = eventGroup.metadata
        this.currentEvent.metadata = this.currentlySelectedMetadata
        this.isSelectedEvent = false
      }
    })

    if (this.isSelectedEvent) {
      this.currentEvent.eventGroupId = undefined
    }
  }

  createSheet() {
    if (!this.inputInvalid()) {

      this.currentEvent.metadata = this.currentEvent.metadata!.filter(data => data !== undefined && data !== '')

      // Elkészíteni az esemény is visszakapni annak id-jét.
      this.sheetService.postEvent(this.currentEvent).subscribe({
        next: (response: string) => {
          //console.log("The created event's id: ", Object.values(response)[0])
          this.createEventGroup.eventIds[0] = Object.values(response)[0]

          // Ha egy esemény lett kiválasztva akkor hozza létre a hozzá tartozó esemény csoportot is.
          if (this.isSelectedEvent) {
            this.createEventGroup.userId = this.userId ?? undefined

            this.createEventGroup.metadata = this.currentEvent.metadata!.slice()
            this.createEventGroup.eventIds[1] = this.selectedEventOrEventGroup!
          
            //console.log(this.createEventGroup)
            this.sheetService.postEventGroup(this.createEventGroup).subscribe({
              next: (response: any) => {
                this.resetPage()
              },
              error: (err) => {
                console.error("Error occurred: ", err)
              },
            })
          }
          else {
            this.resetPage()
          }
        },
        error: (err) => {
          console.error("Error occurred: ", err)
        },
      })
    }
  }

  editSheet() {
    if (!this.inputInvalid()) {

      this.currentEvent.metadata = this.currentEvent.metadata!.filter(data => data !== undefined && data !== '')

      this.currentEvent.eventGroupId = this.selectedEventOrEventGroup

      // Egy esemény frissítése.
      this.sheetService.updateEvent(this.currentEvent).subscribe({
        next: (response: any) => {},
        error: (err) => {
          console.error("Error occurred: ", err)
        },
      })

      this.router.navigate(['/profile'])
    }
  }

  inputInvalid(): boolean {
    if (this.isSelectedEvent) {
      return !(this.currentEvent.name && this.currentEvent.date && this.createEventGroup.name)
    }
    return !(this.currentEvent.name && this.currentEvent.date)
  }

  resetPage(): void {
    this.customFields = []
    this.selectedEventOrEventGroup = undefined
    this.currentEvent = new EventCreateDto()
    this.events = []
    this.eventGroups = []
    this.currentlySelectedMetadata = []
    this.createEventGroup = new EventGroupCreateDto()
    this.isSelectedEvent = false
    this.ngOnInit()
  }

  addCustomField(): void {
    this.customFields.push(this.customFields.length)
  }

  removeCustomField(index: number): void {
    this.customFields.splice(index, 1)
    this.currentEvent.metadata![index] = ""
  }
}
