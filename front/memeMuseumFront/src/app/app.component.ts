import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../Components/header/header.component";
import { FooterComponent } from "../Components/footer/footer.component";
import { AuthService } from '../Services/AuthService/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{
  title = 'memeMuseumFront';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Appena l'app parte, chiediamo al backend: "Sono loggato?"
    this.authService.checkSession().subscribe({
      error: () => console.log("No session active")
    });
  }
}
