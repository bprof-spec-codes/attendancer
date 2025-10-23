import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterModel } from '../models/register-model';
import { environment } from '../../environments/environment';
import { LoginModel } from '../models/login-model';
import { JwtPayload } from '../models/jwt-payload';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  register(registerModel: RegisterModel) {
  return this.http.post(environment.apis.register, registerModel);
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

  logout(): void {
  localStorage.removeItem(environment.tokenKey);
  this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken()
    if (!token) return false;
    const payload = this.getPayload(token)
    if (!payload?.exp) return true;


    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp > nowSec;
  }


  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  private getPayload(token: string): JwtPayload | null {
    try {
      const base64url = token.split('.')[1] ?? '';
      const json = this.base64UrlDecode(base64url);
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  private base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    const s = atob(base64 + pad);
    return decodeURIComponent(
      s.split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
  }
}
