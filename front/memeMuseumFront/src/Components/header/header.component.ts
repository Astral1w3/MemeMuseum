import { Component } from '@angular/core'; 
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/AuthService/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // dichiaro lo stream
  user$;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.currentUser$;
  }

  handleProfileIconClick(){
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('logout error', err)
    });
  }
}