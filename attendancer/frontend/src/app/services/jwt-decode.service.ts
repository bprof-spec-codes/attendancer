import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JwtDecodeService {
  private userId: string | null = null;

  constructor() {
    this.loadUserId();
  }

  private loadUserId(): void {
    const token: string | null = localStorage.getItem(environment.tokenKey);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    }
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public setToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
    this.loadUserId();
  }

  public clearToken(): void {
    localStorage.removeItem(environment.tokenKey);
    this.userId = null;
  }
}
