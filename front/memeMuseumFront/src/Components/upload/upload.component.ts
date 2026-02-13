import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UploadService } from '../../Services/UploadService/upload.service';
import { HttpEventType } from '@angular/common/http';
import { TagInputComponent } from '../tag-input/tag-input.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TagInputComponent],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent {
  uploadForm: FormGroup; //i campi di testo del form
  selectedFile: File | null = null; //file e' un tipo del browser, conterra' il video/img inserita dall'utente
  previewUrl: string | ArrayBuffer | null = null; //URL per mostrare l'anteprima (prima di premere invio)
  fileType: 'image' | 'video' | null = null; //serve per capire se mettere il tag img o video in html
  
  tags: string[] = [];
  isDragging = false; //serve per modificare il css
  isUploading = false;
  uploadProgress = 0; //0-100

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService, // Injection del nuovo service
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]], //obbligatorio + massima lunghezza
      caption: ['', Validators.maxLength(300)]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); //serve per evitare di aprire il file su web
    event.stopPropagation(); //evitiamo l'event bubbling
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files.length) { //se ci sono file
      this.handleFile(event.dataTransfer.files[0]); //prendo solo una cosa
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length) {
      this.handleFile(event.target.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      this.selectedFile = file;
      this.fileType = file.type.startsWith('image/') ? 'image' : 'video';

      const reader = new FileReader(); //creo l'anteprima
      reader.onload = () => {
        this.previewUrl = reader.result; //setto l'anteprima
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only images and video!');
    }
  }

  onTagsUpdated(newTags: string[]) {
    this.tags = newTags;
  }

  onSubmit() {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    this.isUploading = true;
    const { title, caption } = this.uploadForm.value;

    this.uploadService.uploadMeme(this.selectedFile, title, caption, this.tags)
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            console.log('Success:', event.body);
            this.isUploading = false;
            this.router.navigate(['/']); 
          }
        },
        error: (err) => {
          console.error(err);
          this.isUploading = false;
          alert("Upload failed. Please try again.");
        }
      });
  }
}