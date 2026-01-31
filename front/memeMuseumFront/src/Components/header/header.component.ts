import { Component, OnInit, inject } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/AuthService/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchbarComponent, MatIconModule, CommonModule, RouterModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  
  isAuthenticated = false;
  currentUser: User | null = null;
  
  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Sottoscrizione allo stream dell'utente
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user; // true se user esiste, false se null
    });
  }

  handleProfileIconClick(){
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Dopo il logout, vai alla home o login
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('logout error', err)
    });
  }
}