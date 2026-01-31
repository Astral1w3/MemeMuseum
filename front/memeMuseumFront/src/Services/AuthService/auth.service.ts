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

  // Questo tiene traccia dell'utente corrente. Inizia come null (nessuno loggato)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // I componenti si iscriveranno a questo observable per sapere chi è loggato
  public currentUser$ = this.currentUserSubject.asObservable();
  
  register(user: User) {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  login(email: string, password: string) {
    return this.http.post<any>( //modo standard di fare una chiamata API any significa "mi aspetto che il server risponda con un oggetto uqalsiasi"
      `${this.baseUrl}/login`,
      {email, password }, //converte automaticamente in json prima di inviare
      {withCredentials: true} //serve per inviare i cookie ad ogni richiesta e se il server risponde con set-cookie, salva anche quello ricevuto
    ).pipe(
      // 'tap' mi permettere di leggere i dati che passano e farci qualcosa senza modificarli, in questo caso voglio aggiornare lo stato globale
      tap((response) => {
        if(response.status === 'success') {
          // Aggiorniamo lo stato globale dell'app
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
      `${this.baseUrl}/me`, //invia una richiesta di tipo get al server per vedere se il cookie e' ancora valido
      { withCredentials: true }
    ).pipe(
      tap({
        next: (response) => { //se il server ha trovato il cookie allora registriamolo  come utente corrente
          this.currentUserSubject.next(response.user);
        },
        error: () => {
          this.currentUserSubject.next(null); //se il cookie non c'e' allora ci sloggiamo
        }
      })
    );
  }


}