import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user.model'
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // i componenti si iscrivono a questo observable per vedere se un utente e' loggato o meno
  // facciamo il cast come Observable perche' cosi' e' read only
  public currentUser$ = this.currentUserSubject.asObservable();
  
  register(user: User) {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      { email, password }, // converte in json da solo
      { withCredentials: true } // usiamo i cookie
    ).pipe(
      // tap permette di leggere i dati dallo stream, si mette in mezzo, senza modificare lo stream
      tap((response) => {
        if(response.status === 'success') {
          //se l'utente e' loggato settiamolo come utente corrente
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout() {
    return this.http.post(
      `${this.baseUrl}/logout`, 
      {}, 
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
      })
    );
  }

  checkSession() {
    return this.http.get<any>(
      `${this.baseUrl}/me`, // mandiamo una get request per vedere se l'utente e' valido tramite il cookie
      { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => { 
            // in caso di risposta affermativa settiamo il current user
            this.currentUserSubject.next(response.user);
        },
        error: () => {
            // viceversa facciamo logout
            this.currentUserSubject.next(null); 
        }
      })
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}