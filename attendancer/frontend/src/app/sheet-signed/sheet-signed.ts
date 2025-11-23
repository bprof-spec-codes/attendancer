import { Component, OnInit } from '@angular/core';
import { MockDataService } from '../services/mock-data.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-sheet-signed',
  standalone: false,
  templateUrl: './sheet-signed.html',
  styleUrl: './sheet-signed.sass'
})
export class SheetSigned {
  eventIsSigned(): boolean {
    return true;
  }
}
