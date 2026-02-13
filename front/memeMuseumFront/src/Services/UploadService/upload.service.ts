import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService{
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * Carica un nuovo meme sul server.
   * @param file Il file fisico (immagine o video)
   * @param title Il titolo del post
   * @param caption La descrizione opzionale
   * @param tags Array di stringhe con i tag
   */
  uploadMeme(file: File, title: string, caption: string, tags: string[]): Observable<any> {
    const formData = new FormData();

    // corrisponde a upload.single('meme') nel backend
    formData.append('meme', file);
    
    formData.append('title', title);
    formData.append('caption', caption || '');
    
    // serializzare i tag come stringa JSON e' necessario perche' FormData accetta solo stringhe/blob
    formData.append('tags', JSON.stringify(tags));

    return this.http.post(`${this.baseUrl}/upload`, formData, {
      withCredentials: true, // importante per passare il cookie JWT
      reportProgress: true,  // per la barra di caricamento (il classico 10%...30% ecc)
      observe: 'events'      // per monitorare l'upload, ti dice quello che succede step by step
    });
  }
}
