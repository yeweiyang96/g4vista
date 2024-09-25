import { Component, HostBinding, OnInit } from '@angular/core';
import { SearchFieldComponent } from './search-field/search-field.component';
import { DataSourceStorageService } from '../../shared/service/data-source-storage.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-gene',
  standalone: true,
  imports: [SearchFieldComponent, RouterLink, MatButtonModule, MatDivider],
  templateUrl: './gene.component.html',
  styleUrl: './gene.component.scss',
})
export class GeneComponent implements OnInit {
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
        { name: 'Homo sapiens', abbreviation: 'hsa' },
        { name: 'Example 2', abbreviation: 'abbreviation 2' },
        { name: 'Example 3', abbreviation: 'abbreviation 3' },
      ];
    }
  }
}
