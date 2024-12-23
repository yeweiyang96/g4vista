import { Component, input, OnInit } from '@angular/core';
import { GetGenomeService } from '../get-genome-info-api.service';
import { Observable } from 'rxjs';
import { Gene } from '../../../../shared/dataclass/Gene';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchFieldComponent } from '../../../gene/search-field/search-field.component';
@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [AsyncPipe, MatProgressSpinnerModule, SearchFieldComponent],
  templateUrl: './tab3.component.html',
  styleUrl: './tab3.component.scss',
})
export class Tab3Component implements OnInit {
  readonly selected_gene = input<string>();
  readonly selected_chromosome = input.required<string>();
  readonly abbreviation = input.required<string>();
  gene$!: Observable<Gene>;
  constructor(private getGenomeService: GetGenomeService) {}

  ngOnInit(): void {
    if (this.selected_gene()) {
      this.gene$ = this.getGenomeService.getGene(
        this.abbreviation(),
        this.selected_chromosome(),
        this.selected_gene()
      );
    } else {
      this.gene$ = this.getGenomeService.getGene(
        this.abbreviation(),
        this.selected_chromosome()
      );
    }
  }
}
