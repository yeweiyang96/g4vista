import { Component, HostBinding, OnInit, input, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetGenomeService } from './get-genome-info-api.service';
import { Title } from '@angular/platform-browser';
import { GenomeInfo } from '../../../shared/dataclass/Genome';
import { Tab2Component } from './tab2/tab2.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-genome-page',
  standalone: true,
  imports: [MatTabsModule, Tab2Component, MatProgressSpinnerModule],
  templateUrl: './genome-page.component.html',
  styleUrl: './genome-page.component.scss',
})
export class GenomePageComponent implements OnInit {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  readonly abbreviation = input.required<string>();
  data = signal<GenomeInfo>({ genome: 'Loading', chromosome_list: [] });
  constructor(
    private titleService: Title,
    private getGenomeService: GetGenomeService
  ) {}

  ngOnInit(): void {
    this.getGenomeService.get_genome(this.abbreviation()).subscribe(data => {
      this.data.set(data);
      this.titleService.setTitle(data.genome);
    });
  }
}
