import { Component, HostBinding } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-taxonomy',
  standalone: true,
  templateUrl: './taxonomy.component.html',
  styleUrl: './taxonomy.component.scss',
  imports: [SearchBarComponent],
})
export class TaxonomyComponent {
  @HostBinding('class.main-content') readonly mainContentClass = true;
}
