import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TagInputComponent } from '../tag-input/tag-input.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, TagInputComponent],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  // Valori di default
  selectedTags: string[] = [];
  selectedTime: string = 'all';  // filtro data
  selectedSort: string = 'date'; // ordinamento
  selectedOrder: string = 'DESC'; // crescente o decrescente

  constructor(private router: Router, private route: ActivatedRoute) {
    // leggiamo l'url all'avvio per mantenere lo stato se ricarichi la pagina
    this.route.queryParams.subscribe(params => {
      const tagsParam = params['tags'];
      this.selectedTags = tagsParam ? tagsParam.split(',') : [];
      this.selectedTime = params['time'] || 'all';
      this.selectedSort = params['sort'] || 'date';
      this.selectedOrder = params['order'] || 'DESC';
    });
  }

  updateTags(newTags: string[]) {
    this.selectedTags = newTags;
  }

  applyFilters() {
    const tagsString = this.selectedTags.length > 0 ? this.selectedTags.join(',') : null;
    //cambia l'url
    // dato che non vogliamo cambiare pagina usiamo [], stiamo solo aggiornando i parametri dopo ?
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        //se c'e' un tag come "#cats" lo inserisce seno' null
        tags: tagsString,
        time: this.selectedTime,
        sort: this.selectedSort,
        order: this.selectedOrder,
        //partiamo sempre da pagina 1
        page: 1 
      },
      //se ci sono altri parametri fai il merge
      queryParamsHandling: 'merge' 
    });
  }


}