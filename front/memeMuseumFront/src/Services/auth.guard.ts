import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/AuthService/auth.service'
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // prendi solo il valore attuale e chiudi (non restare in ascolto all'infinito)
    map(user => {
      if (user) {
        return true;
      }
      //se non e' loggato non farlo entrare
      router.navigate(['/login']); // redirect a login
      return false; // blocco l'accesso
    })
  );
};