import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FooterComponent,
    NzCarouselModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  array = [
    { name: 'G4 Density', src: 'images/g4_density.png' },
    { name: 'G4 table', src: 'images/g4_table.png' },
    { name: 'Genome Browser', src: 'images/jbrowse.png' },
  ];
}
