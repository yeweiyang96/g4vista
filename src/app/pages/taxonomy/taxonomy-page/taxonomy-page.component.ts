import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-taxonomy-page',
  standalone: true,
  imports: [],
  templateUrl: './taxonomy-page.component.html',
  styleUrl: './taxonomy-page.component.scss',
})
export class TaxonomyPageComponent {
  @HostBinding('class.main-content') readonly mainContentClass = true;
}
