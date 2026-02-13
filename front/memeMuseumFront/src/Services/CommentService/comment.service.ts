import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/posts/${postId}/comments`);
  }

  addComment(postId: number, body: string): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}/posts/${postId}/comments`, 
      { body },
      { withCredentials: true }  //uso i cookie cosi solo chi e' loggato puo scrivere un commento
    );
  }
}