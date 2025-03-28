import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataSourcePickerComponent } from './data-source-picker/data-source-picker.component';
// import { Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    DataSourcePickerComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // private subscriptions = new Subscription();

  sections = [
    // { name: 'Species', route: '/genome' },
    { name: 'Taxonomy', route: '/taxonomy' },
    { name: 'Gene', route: '/gene' },
    { name: 'Environment', route: '/environment' },
  ];

  constructor() {}

  // ngOnDestroy(): void {
  //   this.subscriptions.unsubscribe();
  // }
}
