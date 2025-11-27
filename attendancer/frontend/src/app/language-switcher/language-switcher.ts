import { Component } from '@angular/core';
import { TranslationService } from '../services/translation/translation';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: false,
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.sass']
})

export class LanguageSwitcher {
  currentLanguage: string;
  
  languages: Language[] = [
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  constructor(private translationService: TranslationService) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    
    this.translationService.onLanguageChange().subscribe(event => {
      this.currentLanguage = event.lang;
    });
  }

  changeLanguage(langCode: string): void {
    this.translationService.setLanguage(langCode);
  }
}
