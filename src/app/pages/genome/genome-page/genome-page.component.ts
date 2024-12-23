import {
  Component,
  HostBinding,
  OnInit,
  effect,
  input,
  signal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetGenomeService } from './get-genome-info-api.service';
import { Title } from '@angular/platform-browser';
import { GenomeInfo } from '../../../shared/dataclass/Genome';
import { Tab2Component } from './tab2/tab2.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Tab1Component } from './tab1/tab1.component';
import { Tab3Component } from './tab3/tab3.component';

@Component({
  selector: 'app-genome-page',
  standalone: true,
  imports: [
    MatTabsModule,
    Tab2Component,
    MatProgressSpinnerModule,
    Tab1Component,
    Tab3Component,
  ],
  templateUrl: './genome-page.component.html',
  styleUrl: './genome-page.component.scss',
})
export class GenomePageComponent implements OnInit {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  readonly abbreviation = input.required<string>();
  readonly chromosome$ = input<string>();
  chromosome!: string;
  readonly gene$ = input<string>();
  gene!: string;
  selected = 0;
  data = signal<GenomeInfo>({ genome: 'Loading', chromosome_list: [] });
  constructor(
    private titleService: Title,
    private getGenomeService: GetGenomeService
  ) {
    effect(() => {});
  }

  ngOnInit(): void {
    this.getGenomeService.get_genome(this.abbreviation()).subscribe(data => {
      this.data.set(data);
      this.chromosome = data.chromosome_list[0];
      this.titleService.setTitle(data.genome);
      const c = this.chromosome$();
      if (c) {
        this.selected = 1;
        this.chromosome = c;
        const g = this.gene$();
        if (g) {
          this.selected = 2;
          this.gene = g;
        }
      }
    });
  }
}
