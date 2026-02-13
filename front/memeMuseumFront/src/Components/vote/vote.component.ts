import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../../Services/PostService/post.service';
import { AuthService } from '../../Services/AuthService/auth.service';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {
  // input con valori di default 
  @Input() postId!: number;
  @Input() voteSum: number = 0;
  @Input() userVote: number | null = 0;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  vote(event: Event, type: number) {
    // 1. ferma la propagazione (non apre il post se clicchi la freccia)
    event.stopPropagation();
    event.preventDefault();

    // 2. check Auth
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }

    //Toggle (se clicco quello che ho gia', diventa 0)
    const currentVote = this.userVote || 0; // Evita null
    const newVote = currentVote === type ? 0 : type;
    
    // esempio: passo da -1 a 1. diff e' +2.
    const diff = newVote - currentVote; 

    const oldSum = this.voteSum || 0; // evita NaN
    this.voteSum = oldSum + diff;
    this.userVote = newVote;

    this.postService.votePost(this.postId, newVote).subscribe({
      error: (err) => {
        this.voteSum = oldSum;
        this.userVote = currentVote;
        console.error('Vote failed', err);
      }
    });
  }
}