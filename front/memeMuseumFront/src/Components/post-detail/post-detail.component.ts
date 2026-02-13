import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../Services/PostService/post.service';
import { AuthService } from '../../Services/AuthService/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Post } from '../../models/post.model';
import { CommentsComponent } from '../comment/comment.component';
import { VoteComponent } from '../vote/vote.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CommentsComponent, VoteComponent],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})

export class PostDetailComponent implements OnInit {
  // il ! si chiama Definite Assignment Assertion. 
  // yypescript darebbe errore senza ! perche' vorrebbe che inizializzassimo la variabile
  @Input() id!: string; 
  commentCount: number = 0;
  post: Post | null = null;
  isLoading = true;
  user$;  

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.currentUser$; 
  }

  updateCommentCount(count: number) {
    this.commentCount = count;
  }

  ngOnInit(): void {
    if (this.id) {
      this.loadPost();
    }
  }

  loadPost() {
    this.isLoading = true;
    // il + davanti a this.id serve a convertirlo da String a int
    this.postService.getPostById(+this.id).subscribe({
      next: (res) => {
        // salvo i dati ricevuti dal server
        this.post = res.data || res; 
        console.log(this.post)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Loading error:', err);
        this.isLoading = false;
      }
    });
  }

  isVideo(path: string | undefined): boolean {
    if (!path) return false;
    // check se finisce con mp4, webm o ogg (case insensitive)
    return !!path.match(/\.(mp4|webm|ogg)$/i);
  }

  share(e: Event) {
    e.stopPropagation();
    e.preventDefault();  

    if (!this.post) return;

    const url = `${window.location.origin}/post/${this.post.id}`;
    navigator.clipboard.writeText(url).then(() => alert('Copied!'));
  }

  //ho usato un approccio diverso rispetto a post-card per sfizio personale
  // costruisce l'url completo dell'immagine
  getImageUrl(path: string | undefined): string {
    if (!path) return '';
    return `http://localhost:3000${path}`;
  }

  // tags json -> array di tags
  parseTags(tags: string | string[] | undefined): string[] {
    if (!tags) return [];
    
    // se e' un array, tutto ok
    if (Array.isArray(tags)) return tags;

    // se non lo e' convertiamolo
    try {
      return JSON.parse(tags); 
    } catch (e) {
      return [];
    }
  }
}