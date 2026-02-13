import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent {
  @Input() tags: string[] = []; 
  @Input() maxTags: number = 5; 
  @Input() placeholder: string = 'Add tag...';
  
  @Output() tagsChange = new EventEmitter<string[]>(); // emette la lista aggiornata

  inputValue: string = '';

  // aggiunge un tag quando qualcuno preme invio
  addTag(event: Event) {
    event.preventDefault(); // evita il submit del form se siamo dentro un form
    const value = this.inputValue.trim();

    if (value && !this.tags.includes(value)) {
      if (this.tags.length >= this.maxTags) {
        return;
      }
      this.tags.push(value);
      this.inputValue = ''; //puliamo l'input
      this.emitChange();
    }
  }

  // rimuove un tag cliccando la X
  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.emitChange();
  }

  // notifica il genitore del cambiamento
  private emitChange() {
    this.tagsChange.emit(this.tags);
  }
}