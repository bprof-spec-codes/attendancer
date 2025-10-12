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
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  declarations: [
    App,
    Login,
    Registration,
    Nav,
    Footer,
    Popup
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
