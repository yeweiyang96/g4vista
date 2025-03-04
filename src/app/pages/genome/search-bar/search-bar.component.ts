import { Component, OnInit } from '@angular/core';
import { SearchApiService } from '../../../shared/service/search-api.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaxonomySearch } from '../../../shared/dataclass/Search';
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    AsyncPipe,
    MatFormFieldModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  result$!: Observable<TaxonomySearch[]>;
  private searchTerms = new Subject<string>();
  constructor(
    private apiService: SearchApiService,
    private Router: Router
  ) {}
  ngOnInit(): void {
    this.result$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((search: string) => this.apiService.search(search, 'genome'))
    );
  }

  search(term: string): void {
    term = term.toLowerCase();
    this.searchTerms.next(term);
  }

  // onSelected(event: MatChipListboxChange) {
  //   this.selected = event.value;
  //   this.myControl.setValue('');
  // }

  onClick(name: string) {
    this.Router.navigate(['/genome', name]);
  }
}
