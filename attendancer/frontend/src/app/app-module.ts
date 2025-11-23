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
import { Profile } from './profile/profile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sheet } from './sheet/sheet';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingSpinner } from './loading-spinner/loading-spinner';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SheetForm } from './sheet-form/sheet-form';
import { ModalWarning } from './modal-warning/modal-warning';
import { authenticationInterceptor } from './interceptors/authentication-interceptor';
import { SheetSigned } from './sheet-signed/sheet-signed';

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
    SheetSigned
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
      authenticationInterceptor
    ])
  ),
  provideBrowserGlobalErrorListeners()
],
  bootstrap: [App]
})
export class AppModule { }
