import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
interface Taxonomy {
  abbreviation: string;
  name: string;
  taxonomy: string;
}
@Component({
  selector: 'app-environment',
  standalone: true,
  imports: [
    RouterLink,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    AsyncPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
  ],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.scss',
})
export class EnvironmentComponent {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  examples = [
    { name: 'Deinococcus-Thermus', taxonomy: 'phylum' },
    { name: 'Crenarchaeota', taxonomy: 'phylum' },
    { name: 'Thermotogae', taxonomy: 'phylum' },
    { name: 'Aquificae', taxonomy: 'phylum' },
  ];
  phenotypes = [
    'Growth Temperature',
    'Oxygen Requirement',
    'Salt Concentration',
    'pH Value',
  ];
  result$!: Observable<Taxonomy[]>;
  searchTaxonomy(term: string): void {
    term = term.toLowerCase();
    console.log(term);
  }
  selectPhenotype(term: string): void {
    console.log(term);
  }

  onClick(term: Taxonomy): void {
    console.log(term);
  }
}
