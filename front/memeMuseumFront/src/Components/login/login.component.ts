import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { AuthService } from '../../Services/AuthService/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // login riuscito -> vai alla home
        console.log("Login Success!");
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Login Error", err);
        this.errorMessage = "Email or password are wrong.";
      }
    });
  }
}