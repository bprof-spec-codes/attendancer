import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Nav } from './nav/nav';
import { Footer } from './footer/footer';
import { Popup } from './popup/popup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sheet } from './sheet/sheet';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingSpinner } from './loading-spinner/loading-spinner';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SheetForm } from './sheet-form/sheet-form';
import { ModalWarning } from './modal-warning/modal-warning';

@NgModule({
  declarations: [
    App,
    Login,
    Registration,
    Nav,
    Footer,
    Sheet,
    Popup,
    SheetForm,
    LoadingSpinner,
    ModalWarning
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
