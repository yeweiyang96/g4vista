import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GetGenomeService } from './get-genome-info-api.service';

import { Title } from '@angular/platform-browser';
import { GenomeInfo } from './Genome';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-genome-page',
  standalone: true,
  imports: [MatTabsModule, AsyncPipe],
  templateUrl: './genome-page.component.html',
  styleUrl: './genome-page.component.scss',
})
export class GenomePageComponent implements OnInit {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  @Input() abbreviation = '';
  genomeData$!: Observable<GenomeInfo>;
  constructor(
    private titleService: Title,
    private getGenomeService: GetGenomeService
  ) {}
  ngOnInit(): void {
    this.genomeData$ = this.getGenomeService.get_genome(this.abbreviation);
    this.genomeData$.subscribe(data => {
      this.titleService.setTitle(data.genome);
    });
  }
}
