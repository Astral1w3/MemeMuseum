import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../Services/AuthService/auth.service';
import { User } from '../../models/user.model'
import { Router} from '@angular/router'; 

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) {}

  username: string = "";
  email: string = "";
  password: string = "";

  handleSubmit(){
    console.log(this.username, this.email, this.password);

    const usr: User = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(usr).subscribe({
      next: (response) => {
        console.log("Registration successful", response); 
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error: ', err); 
      }
    })
  }
}
