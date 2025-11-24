import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventClient } from '../app.api-client.generated';

@Component({
  selector: 'app-modal-qrcode',
  standalone: false,
  templateUrl: './modal-qrcode.html',
  styleUrl: './modal-qrcode.sass',
})
export class ModalQrcode implements OnInit{
  @Input() eventId: string = ""
  isOpen = false;
  qrImageUrl: string | null = null;
  // tesztre: 'b4ac92e9-b40d-4f6f-9e49-a4609a49720b'; 
  valid: boolean = true
  message: string | null = null

  constructor(private eventService: EventClient, private router: Router) {}

  ngOnInit() {
    if(this.eventId){
    this.generateQr(this.eventId)
    }
    else{
     console.log("Nincs esemény azonosító")
    }
   //this.generateQr("b4ac92e9-b40d-4f6f-9e49-a4609a49720b") Ez is csak tesztre van itt, az ez előtti if-es ágat commentbe hozzá
    if(this.valid === false){
      this.close()
    }
  }

  generateQr(eventId: string) {
    this.eventService.getEventQrCode(eventId).subscribe({
    next: (response) => {
     const blob = response.data;
      this.qrImageUrl = URL.createObjectURL(blob);
    },
    error: (err) =>{
     console.error(err.message)
    }
    });
  }

  onInvalidateQr(eventId: string) {
    this.eventService.invalidateQr(eventId).subscribe({
    next: () => {
       console.log('QR invalidálva!');
       this.valid = false
    },
    error: err => console.error('Hiba történt:', err.message)
  });
}

  public open(): void {
    this.isOpen = true;
  }

  public close(): void {
    this.isOpen = false;
  }

  remove(): void {
    //this.onInvalidateQr("b4ac92e9-b40d-4f6f-9e49-a4609a49720b") tesztre
    this.onInvalidateQr(this.eventId)
    this.router.navigate(['/sheet']);
  }

}
