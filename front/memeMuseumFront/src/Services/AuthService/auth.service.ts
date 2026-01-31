import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';
  constructor(private http: HttpClient) { }
  
  register(user: User) {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }
}