import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  
  getPosts(
    page: number, 
    limit: number = 10, 
    tags: string = '', 
    time: string = 'all', 
    sort: string = 'date', 
    order: string = 'DESC'
  ): Observable<any> {
    
    // iniziamo con i parametri obbligatori
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // aggiungiamo i filtri solo se hanno un valore
    if (tags) {
      params = params.set('tags', tags);
    }

    if (time && time !== 'all') {
      params = params.set('time', time);
    }

    if (sort) {
      params = params.set('sort', sort);
    }

    if (order) {
      params = params.set('order', order);
    }

    // facciamo la chiamata passando i params e le credenziali (cookie)
    return this.http.get<{ status: string, data: Post[] }>(
      `${this.baseUrl}/posts`, 
      { params, withCredentials: true }
    );
  }

  getPostById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/posts/${id}`,
      { withCredentials: true }
    );
  }

  votePost(postId: number, value: number) {
    return this.http.post(`${this.baseUrl}/posts/${postId}/vote`, 
      { value }, 
      { withCredentials: true }
    );
  }

  getTodaysBestPost() {
    return this.http.get<{ status: string, data: any }>(
      `${this.baseUrl}/posts/todays-best`,
      { withCredentials: true }
    );
  }
}
