import { Component } from '@angular/core';
import { AuthService } from '../../Services/AuthService/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user$;

  constructor(
    public authService: AuthService
  ) {
    this.user$ = this.authService.currentUser$;
  }
}
