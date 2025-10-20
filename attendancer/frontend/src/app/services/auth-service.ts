import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterModel } from '../models/register-model';
import { environment } from '../../environments/environment';
import { LoginModel } from '../models/login-model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(registerModel: RegisterModel): void {
    this.http.post<{ token: string }>(environment.apis.register, registerModel)
      .subscribe({
        next: (res) => {
          const token = res?.token;
          if (!token) {
            console.error('Register response does not contain a token.');
            return;
          }
          localStorage.setItem(environment.tokenKey, token);
          console.log('Registration successful!');
          },
          error: (err) => {
            console.error('Registration error:', err);
          }
      });
  }

  login(loginModel: LoginModel): void {
    this.http.post<{ token: string}>(environment.apis.login, loginModel)
    .subscribe({
      next: (res) => {
        const token = res?.token
        if (!token) {
          console.error('Login response does not contain a token.')
          return
        }
        localStorage.setItem(environment.tokenKey, token)
        console.log('Registration successful!')
      },
      error: (err) => {
        console.error('Login error:', err)
      }
    })
  }


}
