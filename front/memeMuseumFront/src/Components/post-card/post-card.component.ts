import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/post.model'; 
import { CommentsComponent } from '../comment/comment.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  //riceve i dati del post dal genitore (feed)
  @Input() post!: Post;

  // image_path ci da una parte del path, l'altra dobbiamo aggiungerla noi
  get imageUrl(): string {
    if (!this.post.image_path) return '';
    //il database salva solo il percorso relativo
    return `http://localhost:3000${this.post.image_path}`;
  }

  // da stringa a lista di stringhe
  get parsedTags(): string[] {
    if (!this.post.tags) return [];
    
    //se gia e' un array lo restituiamo
    if (Array.isArray(this.post.tags)) return this.post.tags;

    // se non lo e' facciamo il parsing
    try {
      return JSON.parse(this.post.tags); 
    } catch (e) {
      console.error('Error parsing tags:', e);
      return [];
    }
  }

  isVideo(path: string | undefined): boolean {
    if (!path) return false;
    // check se finisce con mp4, webm o ogg (case insensitive)
    return !!path.match(/\.(mp4|webm|ogg)$/i);
  }
}