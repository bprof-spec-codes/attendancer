import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
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
import { LoadingSpinner } from './loading-spinner/loading-spinner';
import { SheetForm } from './sheet-form/sheet-form';
import { ModalWarning } from './modal-warning/modal-warning';
import { authenticationInterceptor } from './interceptors/authentication-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor';
import { loadingInterceptor } from './interceptors/loading-interceptor';
import { loggingInterceptor } from './interceptors/logging-interceptor';
import { mockDataInterceptor } from './interceptors/mock-data-interceptor';

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
