import { Component, inject } from '@angular/core';
import { SearchbarComponent } from "../searchbar/searchbar.component";
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [SearchbarComponent, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  
  handleProfileIconClick(){
    this.router.navigate(['/profile']);
  }
}
