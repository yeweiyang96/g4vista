import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-environment',
  standalone: true,
  imports: [],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.scss',
})
export class EnvironmentComponent {
  @HostBinding('class.main-content') readonly mainContentClass = true;
}
