import { SearchResult } from '../../../shared/dataclass/Search';
import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { SearchApiService } from '../../../shared/service/search-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    AsyncPipe,
    MatFormFieldModule,
  ],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss',
})
export class SearchFieldComponent implements OnInit {
  genome = 'hsa';
  resultGenome$!: Observable<SearchResult[]>;
  resultGene$!: Observable<string[]>;
  private searchGenomeTerms = new Subject<string>();
  private searchGeneTerms = new Subject<string[]>();

  constructor(
    private apiService: SearchApiService,
    private Router: Router
  ) {}
  ngOnInit(): void {
    this.resultGenome$ = this.searchGenomeTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((search: string) => this.apiService.search_genome(search))
    );

    this.resultGene$ = this.searchGeneTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((search: string[]) => this.apiService.search_gene(search))
    );
  }

  clearGenomeInput() {
    this.genome = '';
  }

  searchGenomeInput(term: string): void {
    term = term.toLowerCase();
    this.searchGenomeTerms.next(term);
  }

  searchGeneInput(term: string): void {
    term = term.toLowerCase();
    this.searchGeneTerms.next([this.genome, term]);
  }

  onClick(result: SearchResult) {
    this.genome = result.abbreviation;
    console.log(this.genome);
  }

  navTo(result: string) {
    this.Router.navigate(['/gene', this.genome, result]);
  }
}
