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
    return this.http.put<User>(environment.apis.updateUser, user);
  }

  updatePassword(user: User): Observable<User> {
  return this.http.put<User>(environment.apis.changePassword, user);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(environment.apis.deleteAccount);
  }
}

