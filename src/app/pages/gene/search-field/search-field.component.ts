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
import { GeneResult } from '../../../shared/dataclass/Search';

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
  resultGene$!: Observable<GeneResult[]>;

  private searchGeneTerms = new Subject<string>();

  constructor(
    private apiService: SearchApiService,
    private Router: Router
  ) {}
  ngOnInit(): void {
    this.resultGene$ = this.searchGeneTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((search: string) => this.apiService.search_gene(search))
    );
  }

  searchGeneInput(term: string): void {
    term = term.toLowerCase();
    this.searchGeneTerms.next(term);
  }

  navTo(result: GeneResult) {
    this.Router.navigate([
      '/genome',
      result.abbreviation,
      result.chromosome,
      result.name,
    ]);
    // this.Router.navigate(['/genome/']);
  }
}
