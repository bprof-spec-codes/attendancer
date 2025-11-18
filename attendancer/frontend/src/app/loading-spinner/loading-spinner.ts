import { Component, inject } from '@angular/core';
import { LoadingSpinnerService } from '../services/loading-spinner-service';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.sass'
})
export class LoadingSpinner {
  spinner = inject(LoadingSpinnerService);
}
