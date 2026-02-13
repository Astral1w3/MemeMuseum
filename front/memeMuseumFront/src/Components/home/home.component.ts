import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Post } from '../../models/post.model';
import { PostService } from '../../Services/PostService/post.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { AuthService } from '../../Services/AuthService/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostCardComponent, SidebarComponent,],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  posts: Post[] = []; // la lista che cresce

  // variabili per la paginazione
  currentPage = 1;
  itemsPerPage = 10;
  isLoading = false;
  hasMorePosts = true; // diventa false quando il server non ha più nulla

  //variabili per mantenere lo stato dei filtri attuali
  currentTags = '';
  currentTime = 'all';
  currentSort = 'date';
  currentOrder = 'DESC';

  // elemento "sentinella" invisibile a fine pagina
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  private observer: IntersectionObserver | null = null;

  user$;

  constructor(private postService: PostService, private authService: AuthService, private route: ActivatedRoute) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // questo gestisce sia il caricamento iniziale (nessun parametro) 
    // sia quando l'utente applica i filtri
    this.route.queryParams.subscribe(params => {
      
      // se cambiano i filtri, dobbiamo svuotare la lista e ripartire da pag 1
      this.posts = [];
      this.currentPage = 1;
      this.hasMorePosts = true;
      this.isLoading = false;

      // aggiorniamo le variabili locali con i valori dell'url (o default)
      this.currentTags = params['tags'] || '';
      this.currentTime = params['time'] || 'all';
      this.currentSort = params['sort'] || 'date';
      this.currentOrder = params['order'] || 'DESC';

      // carichiamo i dati con i nuovi filtri
      this.loadPosts();
    });
  }

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  loadPosts() {
    if (this.isLoading || !this.hasMorePosts) return;

    this.isLoading = true;

    // passiamo tutti i filtri correnti al service
    this.postService.getPosts(
      this.currentPage, 
      this.itemsPerPage,
      this.currentTags,  // Tags
      this.currentTime,  // Time
      this.currentSort,  // Sort
      this.currentOrder  // Order
    ).subscribe({
      next: (res) => {
        const newPosts = res.data || []; 

        if (newPosts.length < this.itemsPerPage) {
          this.hasMorePosts = false;
        }

        // concateniamo i nuovi post
        this.posts = [...this.posts, ...newPosts];
        
        this.currentPage++;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.isLoading = false;
      }
    });
  }

  setupObserver() {
    const options = {
      root: null, // viewport
      threshold: 0.1 // scatta quando il 10% del div è visibile
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.loadPosts();
      }
    }, options);

    if (this.scrollAnchor) {
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  // ottimizzazione per *ngFor ovvero evita di ridisegnare tutto il DOM
  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}