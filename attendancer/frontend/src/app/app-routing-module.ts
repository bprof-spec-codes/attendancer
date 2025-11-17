import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Registration } from './registration/registration';
import { Sheet } from './sheet/sheet';
import { SheetForm } from './sheet-form/sheet-form';
import { authGuard } from './auth-guard';
import { Profile } from './profile/profile';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login },
  { path: 'register', component: Registration },
  { path: 'sheet/:id', component: Sheet },
  { path: 'sheet', component: Sheet }, //UI tesztelésre van
  { path: 'createSheet', component: SheetForm, canActivate: [authGuard] },
  { path: 'create', component: SheetForm }, //UI tesztelésre van
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'prof', component: Profile }, //UI tesztelésre van
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
