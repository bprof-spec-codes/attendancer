import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';

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
    name: "",
    eventGroupId: "",
    date: "",
    metadata: []
  }
  events: any[] = []
  eventGroups: any[] = []
  currentlySelectedMetadata: string[] = []
  userId: string = (Math.floor(Math.random() * 3) + 1).toString() // a bejelentkezett felhasználó id-jének mock-olása

  constructor(private mockDataService: MockDataService) {}

  /**
   * Lekérni az jelenleg bejelentkezett felhasználó által készített eseményeket és esemény csoportokat.
   */
  ngOnInit(): void {
    this.mockDataService.getEventsByUserId(this.userId).subscribe((data) => {
      this.events = data;
    });

    this.mockDataService.getEventGroupsWithMetadataByUserId(this.userId).subscribe((data) => {
      this.eventGroups = data;
    });
  }

  /**
   * Egy esemény vagy esemény csoport kiválasztásakor a megfelelő metaadatokat betölteni és kiírni.
   * @param selectedValue - A kiválasztott esemény vagy esemény csoport id-ja.
   */
  onSelectionChange(selectedValue: string) {
    this.currentEvent.eventGroupId = selectedValue

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
      // Ha már meglévő eseményhez vagy esemény csoporthoz lesz hozzárendelve a jelenleg elkészült esemény akkor nem lesz elküldve a metadata.
      this.mockDataService.postEvent(this.currentEvent)
      this.resetPage()
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

  addCustomField(): void {
    this.customFields.push(this.customFields.length);
  }

  removeCustomField(index: number): void {
    this.customFields.splice(index, 1);
  }
}
