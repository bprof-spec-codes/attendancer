import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

// Egyedi HTTP Loader
export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }
}

// HTTP Loader factory function
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new CustomTranslateLoader(http);
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'selectedLanguage';
  private readonly DEFAULT_LANGUAGE = 'hu';
  private readonly AVAILABLE_LANGUAGES = ['hu', 'en', 'de'];

  constructor(private translate: TranslateService) {}

  init(): void {
    this.translate.addLangs(this.AVAILABLE_LANGUAGES);
    this.translate.setDefaultLang(this.DEFAULT_LANGUAGE);
    const savedLanguage = this.getSavedLanguage();
    const browserLanguage = this.getBrowserLanguage();
    const languageToUse = savedLanguage || browserLanguage || this.DEFAULT_LANGUAGE;
    this.setLanguage(languageToUse);
  }

  setLanguage(lang: string): void {
    if (this.AVAILABLE_LANGUAGES.includes(lang)) {
      this.translate.use(lang);
      this.saveLanguage(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.DEFAULT_LANGUAGE;
  }

  getAvailableLanguages(): string[] {
    return this.AVAILABLE_LANGUAGES;
  }

  onLanguageChange() {
    return this.translate.onLangChange;
  }

  private getSavedLanguage(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private saveLanguage(lang: string): void {
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  private getBrowserLanguage(): string | null {
    const browserLang = this.translate.getBrowserLang();
    return browserLang && this.AVAILABLE_LANGUAGES.includes(browserLang) 
      ? browserLang 
      : null;
  }

  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get(key: string, params?: any) {
    return this.translate.get(key, params);
  }
}