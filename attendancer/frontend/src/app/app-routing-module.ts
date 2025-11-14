import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Sheet } from './sheet/sheet';
import { SheetForm } from './sheet-form/sheet-form';
import { authGuard } from './auth-guard';
import { QrCode } from './qr-code/qr-code';
import { Participant } from './participant/participant';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Registration },
  { path: 'sheet/:id', component: Sheet },
  { path: 'qr/:id', component: QrCode },
  { path: 'participant/:id', component: Participant },
  {path: 'createSheet', component: SheetForm, canActivate: [authGuard]},
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
