import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; 
import { PostService } from '../../Services/PostService/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private postService: PostService, private router: Router) {}

  goToBest() {
    this.postService.getTodaysBestPost().subscribe({
      next: (res) => {
        if (res.data && res.data.id) {
          this.router.navigate(['/post', res.data.id]); 
        }
      },
      error: (err) => {
        console.warn("Not Meme Found", err);
        alert("Still no memes today!");
      }
    });
  }
}