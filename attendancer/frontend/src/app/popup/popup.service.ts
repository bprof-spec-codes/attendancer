import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PopupService {
  message: string = '';
  visible = false;

  show(message: string, duration: number = 3000) {
    this.message = message;
    this.visible = true;

    setTimeout(() => {
      this.close()
    }, duration);
  }

  close() {
    this.visible = false;
    this.message = '';
  }
}