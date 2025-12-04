import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventClient } from '../app.api-client.generated';

@Component({
  selector: 'app-modal-qrcode',
  standalone: false,
  templateUrl: './modal-qrcode.html',
  styleUrl: './modal-qrcode.sass',
})
export class ModalQrcode implements OnInit {
  @Input() eventId: string = ""
  @Output() isQrValid: EventEmitter<boolean> = new EventEmitter<boolean>()
  isOpen = false
  qrImageUrl: string | null = null
  valid: boolean = true
  message: string | null = null

  constructor(private eventService: EventClient, private router: Router) {}

  ngOnInit() {
    if (this.eventId) {
      this.generateQr()
    }
    else {
      console.log("Nincs esemény azonosító!")
    }

    if (this.valid === false) {
      this.close()
    }
  }

  generateQr() {
    this.eventService.getEventQrCode(this.eventId).subscribe({
      next: (response) => {
        const blob = response.data
        this.qrImageUrl = URL.createObjectURL(blob);
      },
      error: (err) =>{
        console.error(err.message)
      }
    });
  }

  onInvalidateQr() {
    this.eventService.invalidateQr(this.eventId).subscribe({
      next: () => {
        console.log('QR invalidálva!')
        this.valid = false
        this.isQrValid.emit(this.valid)
      },
      error: err => console.error('Hiba történt: ', err.message)
    });
  }

  public open(): void {
    this.isOpen = true
  }

  public close(): void {
    this.isOpen = false
  }

  remove(): void {
    this.onInvalidateQr()
    this.close()
  }
}
