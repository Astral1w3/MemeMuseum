import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';

  handleLogin() {
    console.log('Login attempt:', { 
        username: this.username, 
        email: this.email, 
        password: this.password 
    });
    // Qui inserisci la chiamata al tuo servizio di autenticazione
  }
}