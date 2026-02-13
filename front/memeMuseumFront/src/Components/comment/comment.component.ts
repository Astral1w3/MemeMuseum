import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router'; 
import { CommentService } from '../../Services/CommentService/comment.service';
import { AuthService } from '../../Services/AuthService/auth.service';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number; // riceve l'id del post dal padre 
  @Output() countChange = new EventEmitter<number>();

  comments: Comment[] = [];
  newCommentText: string = '';
  isLoading = false;
  isSubmitting = false;
  
  user$;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    if (this.postId) {
      this.loadComments();
    }
  }

  loadComments() {
    this.isLoading = true;
    this.commentService.getComments(this.postId).subscribe({
      next: (data) => {
        this.comments = data;
        this.isLoading = false;
        this.countChange.emit(this.comments.length);
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.isLoading = false;
      }
    });
  }

  submitComment() {
    if (!this.newCommentText.trim()) return;

    this.isSubmitting = true;
    
    this.commentService.addComment(this.postId, this.newCommentText).subscribe({
      next: (newComment) => {
        // aggiungo il commento in cima alla lista localmente
        // oppure dovrei richiedere tutti i commenti al server di nuovo
        this.comments.unshift(newComment);
        this.newCommentText = ''; // pulisco input
        this.countChange.emit(this.comments.length);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error posting comment', err);
        alert('Could not post comment. Are you logged in?');
        this.isSubmitting = false;
      }
    });
  }
}