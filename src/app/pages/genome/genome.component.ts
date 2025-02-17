import { Component, HostBinding, OnInit } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { MatDivider } from '@angular/material/divider';
import { DataSourceStorageService } from '../../shared/service/data-source-storage.service';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-genome',
  standalone: true,
  imports: [
    SearchBarComponent,
    RouterLink,
    MatButtonModule,
    MatDivider,
    NzGridModule,
    NzStatisticModule,
    DecimalPipe,
  ],
  templateUrl: './genome.component.html',
  styleUrl: './genome.component.scss',
})
export class GenomeComponent implements OnInit {
  @HostBinding('class.main-content') readonly mainContentClass = true;
  examples = [
    { name: 'Homo sapiens', abbreviation: 'hsa' },
    { name: 'Example 2', abbreviation: 'abbreviation 2' },
    { name: 'Example 3', abbreviation: 'abbreviation 3' },
    { name: 'Example 1', abbreviation: 'abbreviation 1' },
    { name: 'Example 2', abbreviation: 'abbreviation 2' },
    { name: 'Example 3', abbreviation: 'abbreviation 3' },
  ];
  constructor(private dataSourceStorage: DataSourceStorageService) {}
  ngOnInit(): void {
    if (this.dataSourceStorage.getStoredSource() == 'mbgd') {
      this.examples = [
        { name: 'Human', abbreviation: 'hsa' },
        { name: 'Fruit fly', abbreviation: 'dme' },
        { name: 'Thale cress', abbreviation: 'ath' },
      ];
    }
  }
}
