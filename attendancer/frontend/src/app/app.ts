import { Component, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.sass'
})
export class App {
  protected readonly title = signal('frontend');
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang() || '';
    translate.use(browserLang.match(/en|hu|de/) ? browserLang : 'en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
