import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchApiService } from '../../../shared/service/search-api.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  debounceTime,
  // distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { TaxonomySearch } from '../../../shared/dataclass/Search';

interface Taxonomy {
  viewValue: string;
  isGroup: boolean;
  value: string;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  searchtypes: Taxonomy[] = [
    { viewValue: 'Genome', isGroup: false, value: 'genome' },
    { viewValue: 'Species', isGroup: true, value: 'species' },
    { viewValue: 'Genus', isGroup: true, value: 'genus' },
    { viewValue: 'Family', isGroup: true, value: 'family' },
    { viewValue: 'Order', isGroup: true, value: 'order' },
    { viewValue: 'Class', isGroup: true, value: 'class' },
    { viewValue: 'Phylum', isGroup: true, value: 'phylum' },
    { viewValue: 'Superkingdom', isGroup: true, value: 'superkingdom' },
  ];
  searchType: Taxonomy = this.searchtypes[0];
  searchTerm: string = '';
  result$!: Observable<TaxonomySearch[]>;
  private searchTerms = new Subject<string>();
  constructor(
    private apiService: SearchApiService,
    private Router: Router
  ) {}
  ngOnInit(): void {
    this.result$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      // distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((searchInput: string) =>
        this.apiService.search(searchInput, this.searchType.value)
      )
    );
  }

  search(term: string): void {
    term = term.toLowerCase();
    this.searchTerms.next(term);
  }

  onSearchTypeChange() {
    if (this.searchTerm) {
      this.search(this.searchTerm);
    } else {
      console.log('empty');
    }
  }

  onClick(searchItem: string) {
    if (this.searchType.isGroup) {
      this.Router.navigate(['/taxonomy', searchItem]);
    } else {
      this.Router.navigate(['/genome', searchItem]);
    }
  }
}
