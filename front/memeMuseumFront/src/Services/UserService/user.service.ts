import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   baseUrl = 'http://localhost:3000/user/';
  constructor(private http: HttpClient) { }

}
