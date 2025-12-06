import { Component } from '@angular/core';

@Component({
  selector: 'app-sheet-signed',
  standalone: false,
  templateUrl: './sheet-signed.html',
  styleUrls: ['./sheet-signed.sass']
})
export class SheetSigned {
  eventIsSigned(): boolean {
    return true;
  }
}
