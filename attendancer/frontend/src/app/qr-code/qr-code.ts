import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event-service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-qr-code',
  standalone: false,
  templateUrl: './qr-code.html',
  styleUrl: './qr-code.sass'
})
export class QrCode implements OnInit{
  qrUrl: string | null = null;
  eventId: string | null = null // tesztre: 'b4ac92e9-b40d-4f6f-9e49-a4609a49720b'; 
  valid: boolean = true
  message: string | null = null

   constructor(private eventService: EventService, private route: ActivatedRoute) {}

   ngOnInit() {
    this.route.paramMap.subscribe(params =>
      this.eventId = params.get('id'))

    if (!this.eventId) return;
    this.eventService.generateQr(this.eventId).subscribe({
      next: (res) => {  
        this.qrUrl = res.qrCodeUrl; // itt kapod vissza a teljes QR elérési útvonalat
        console.log("Ez a kapott URL:" + res.qrCodeUrl)
        console.log(res)
      },
      error: (err) => { 
        console.error(err)
        this.message = err.error.errorMessage
        if(this.message == null)
          this.message = "Ismeretlen hiba történt"
      }
    })
  }


}

