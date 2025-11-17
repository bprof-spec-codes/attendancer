import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${environment.apis.getUserMe}`);
  }
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apis.getUser}/${user.id}`, user);
  }

  updatePassword(userId: string, passwordData: any): Observable<any> {
  const url = environment.apis.changePassword.replace('{id}', userId);
  return this.http.put<any>(url, passwordData);
}

}

