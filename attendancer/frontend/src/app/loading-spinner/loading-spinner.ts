import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.sass'
})
export class LoadingSpinner {
  isLoading = false

  show() {
    this.isLoading = true
  }

  hide() {
    this.isLoading = false
  }
}
