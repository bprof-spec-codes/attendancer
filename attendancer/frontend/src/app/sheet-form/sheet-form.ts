import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sheet-form',
  standalone: false,
  templateUrl: './sheet-form.html',
  styleUrl: './sheet-form.sass',
})
export class SheetForm {
  customFields: number[] = [];

  addCustomField(): void {
    this.customFields.push(this.customFields.length);
  }

  removeCustomField(index:number){
    this.customFields.splice(index, 1);
  }
}
