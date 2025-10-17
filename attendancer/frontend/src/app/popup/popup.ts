import { Component } from '@angular/core';
import { PopupService } from './popup.service';

@Component({
  selector: 'app-popup',
  standalone: false,
  templateUrl: './popup.html',
  styleUrls: ['./popup.sass'],
})
export class Popup {
  constructor(public popup: PopupService) {}
}