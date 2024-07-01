import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../shared/footer/footer.component';
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
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  @HostBinding('class.main-content') readonly mainContentClass = true;

}
