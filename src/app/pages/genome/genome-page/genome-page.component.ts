import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetGenomeService } from './get-genome-info-api.service';
import { Title } from '@angular/platform-browser';
import { GenomeInfo } from '../../../shared/dataclass/Genome';
import { Observable } from 'rxjs';
// import { ParsedLocString } from '@jbrowse/core/util';
import { Tab2Component } from './tab2/tab2.component';

@Component({
  selector: 'app-genome-page',
  standalone: true,
  imports: [MatTabsModule, Tab2Component],
  templateUrl: './genome-page.component.html',
  styleUrl: './genome-page.component.scss',
})
export class GenomePageComponent implements OnInit {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  @Input() abbreviation = '';
  genomeData$!: Observable<GenomeInfo>;
  data: GenomeInfo = {
    genome: 'Loading...',
    chromosomes: [],
    description: 'Loading...',
  };

  constructor(
    private titleService: Title,
    private getGenomeService: GetGenomeService
  ) {}

  ngOnInit(): void {
    // get genome data file ()
    this.getGenomeService
      .get_genome(this.abbreviation)
      .subscribe((data: GenomeInfo) => {
        this.titleService.setTitle(data.genome);
        this.data = data;
      });
  }
}
