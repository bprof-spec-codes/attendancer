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
  currentEvent: any = { // egy Event mock-olása - itt majd ez lesz: currentEvent: Event
    id: "",
    name: "",
    date: "",
    eventGroupId: "",
    metadata: []
  }
  events: any[] = []
  eventGroups: any[] = []
  currentlySelectedMetadata: string[] = []
  userId: string = (Math.floor(Math.random() * 3) + 1).toString() // a bejelentkezett felhasználó id-jének mock-olása
  editMode: boolean = false

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private mockDataService: MockDataService, 
    private editEventService: EditEventService
  ) {}

  /**
   * Lekérni az jelenleg bejelentkezett felhasználó által készített eseményeket és esemény csoportokat.
   */
  ngOnInit(): void {
    // Ellenőrizni, hogy melyik az editSheet oldalra jöttünk-e.
    if (this.route.snapshot.routeConfig?.path === "editSheet") {

      // Igazra állítani a szerkesztő módot.
      this.editMode = true

      // Lekérni a megfelelő esemény adatait.
      this.currentEvent = this.editEventService.getEvent();

      // Ha nem kapott adatot, pl.: oldal újratöltése miatt.
      if (this.currentEvent === undefined) {
        this.router.navigate(['/createSheet']);
      }

      // Létrehozni az opcionális adatok darabszámú inputmezőt.
      this.currentEvent.metadata.forEach(() => {
        this.addCustomField()
      });

      // A megkapott eseményt beállítani a kiválasztott eseményre.
      this.selectedEventOrEventGroup = this.currentEvent.eventGroupId
      this.onSelectionChange(this.currentEvent.eventGroupId)
    }
    
    // Lekérdezni az esemény adatait.
    this.mockDataService.getEventsByUserId(this.userId).subscribe((data) => {
      this.events = data;
    });

    // Lekérdezni az eseménycsoport neveit és metaadataival.
    this.mockDataService.getEventGroupsWithMetadataByUserId(this.userId).subscribe((data) => {
      this.eventGroups = data;
    });
  }

  /**
   * Egy esemény vagy esemény csoport kiválasztásakor a megfelelő metaadatokat betölteni és kiírni.
   * @param selectedValue - A kiválasztott esemény vagy esemény csoport id-ja.
   */
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

  /**
   * Meghívja az új esemény felvételét a service-ből ha érvényes a bemenet és meghívja az oldal alap állapotába való visszaállítását.
   */
  createSheet() {
    // Nagyon egyszerű validáció.
    if (!this.inputInvalid()) {

      // Kitörölni az üres metaadatokat a tömbből.
      this.currentEvent.metadata = this.currentEvent.metadata.filter((data: undefined) => data !== undefined && data !== '')

      // Ha már meglévő eseményhez vagy esemény csoporthoz lesz hozzárendelve a jelenleg elkészült esemény akkor nem lesz elküldve a metadata.
      this.mockDataService.postEvent(this.currentEvent)
      this.resetPage()
    }
  }

  editSheet() {
    // Nagyon egyszerű validáció.
    if (!this.inputInvalid()) {

      // Kitörölni az üres metaadatokat a tömbből.
      this.currentEvent.metadata = this.currentEvent.metadata.filter((data: undefined) => data !== undefined && data !== '')

      // Felülírni az esemény csoport id-jét a kiválasztottra.
      this.currentEvent.eventGroupId = this.selectedEventOrEventGroup

      // Elküldeni a frissített esemény adatait majd átirányítrani a felhasználót egy másik oldalra.
      this.mockDataService.updateEvent(this.currentEvent)
      this.router.navigate(['/profile']);
    }
  }

  /**
   * Ellenőrzi a bemenetet, hogy ne legyen üres.
   * @returns boolean - Igazat ad vissza ha a bemenet üres névre és/vagy a dátumra. Ha ezek teljesülnek akkor igazat ad vissza.
   */
  inputInvalid(): boolean {
    return !(this.currentEvent.name.length > 0 && this.currentEvent.date.length > 0)
  }

  /**
   * Minden értéket alap állapotra visszaállítani és újra lekérni az adatokat.
   */
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

  /**
   * Opcionális adathoz egy inputmező hozzáadása.
   */
  addCustomField(): void {
    this.customFields.push(this.customFields.length);
  }

  /**
   * Az opcionális adathoz a megadott indexű inputmező és annak tartalmának törlése.
   * @param index - A törölni kívánt inputmező és annak tartalmának id-ja.
   */
  removeCustomField(index: number): void {
    this.customFields.splice(index, 1);
    this.currentEvent.metadata[index] = ""
  }
}
