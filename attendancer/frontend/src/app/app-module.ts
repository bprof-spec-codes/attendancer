import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Nav } from './nav/nav';
import { Footer } from './footer/footer';
import { Popup } from './popup/popup';
import { Profile } from './profile/profile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sheet } from './sheet/sheet';
import { LoadingSpinner } from './loading-spinner/loading-spinner';
import { SheetForm } from './sheet-form/sheet-form';
import { ModalWarning } from './modal-warning/modal-warning';
import { authenticationInterceptor } from './interceptors/authentication-interceptor';
import { mockDataInterceptor } from './interceptors/mock-data-interceptor';
import { loggingInterceptor } from './interceptors/logging-interceptor';
import { loadingInterceptor } from './interceptors/loading-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './services/tanslation/translation';
import { LanguageSwitcher } from './language-switcher/language-switcher';
import { SheetSigned } from './sheet-signed/sheet-signed';
import { ModalQrcode } from './modal-qrcode/modal-qrcode';

@NgModule({
  declarations: [
    App,
    Login,
    Registration,
    Nav,
    Footer,
    Profile,
    Sheet,
    Popup,
    SheetForm,
    LoadingSpinner,
    ModalWarning,
    LanguageSwitcher,
    SheetSigned,
    ModalQrcode
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
  ],
  providers: [
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        authenticationInterceptor,
        loadingInterceptor,
        loggingInterceptor,
        mockDataInterceptor
      ])
    ),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
