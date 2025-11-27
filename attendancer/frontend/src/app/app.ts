import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './services/tanslation/translation';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.sass'
})
export class App {
  protected readonly title = signal('frontend');
  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.translationService.init();
  }
}
