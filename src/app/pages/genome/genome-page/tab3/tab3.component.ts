import { Component, input, OnInit } from '@angular/core';
import { GetGenomeService } from '../get-genome-info-api.service';
import { Observable } from 'rxjs';
import { Gene } from '../../../../shared/dataclass/Gene';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchFieldComponent } from '../../../gene/search-field/search-field.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,
    SearchFieldComponent,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    JsonPipe,
  ],
  templateUrl: './tab3.component.html',
  styleUrl: './tab3.component.scss',
})
export class Tab3Component implements OnInit {
  readonly selected_gene = input<string>();
  readonly selected_chromosome = input.required<string>();
  readonly abbreviation = input.required<string>();
  gene$!: Observable<Gene>;
  constructor(private getGenomeService: GetGenomeService) {}
  displayedColumns: string[] = ['T1', 'T2', 'T3', 'T4', 'TS', 'GS', 'SEQ'];
  positions: string[] = [
    'inside_plus',
    'upstream_1k_plus',
    'part_overlap_upstream_plus',
    'part_overlap_downstream_plus',
    'upstream_2k_plus',
    'upstream_3k_plus',
    'upstream_4k_plus',
    'upstream_5k_plus',
    'downstream_1k_plus',
    'downstream_2k_plus',
    'downstream_3k_plus',
    'downstream_4k_plus',
    'downstream_5k_plus',
    'inside_minus',
    'part_overlap_upstream_minus',
    'part_overlap_downstream_minus',
    'upstream_1k_minus',
    'upstream_2k_minus',
    'upstream_3k_minus',
    'upstream_4k_minus',
    'upstream_5k_minus',
    'downstream_1k_minus',
    'downstream_2k_minus',
    'downstream_3k_minus',
    'downstream_4k_minus',
    'downstream_5k_minus',
  ];

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
  removeUnderscores(str: string): string {
    return str.replace(/_/g, ' ');
  }
}
