import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { StyleManagerService } from '../../service/style-manager.service';
import {
  DataSourceStorageService,
  DataSource,
} from '../../service/data-source-storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
// import {normalizedMaterialVersion} from '../normalized-version';

@Component({
  selector: 'app-data-source-picker',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-source-picker.component.html',
  styleUrl: './data-source-picker.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DataSourcePickerComponent implements OnInit, OnDestroy {
  private _queryParamSubscription = Subscription.EMPTY;
  currentDataSource: DataSource | undefined;
  dataSources: DataSource[] = [
    {
      name: 'ncbi',
      displayName: 'NCBI',
      isDefault: true,
      color: '#d7e3ff',
      background: '#fdfbff',
      cssName: 'azure-blue',
    },
    {
      name: 'mbgd',
      displayName: 'MBGD',
      color: '#77ff61',
      background: '#fcfdf6',
      cssName: 'green-chartreuse',
    },
  ];

  constructor(
    public styleManagerService: StyleManagerService,
    private _dataSourceStorageService: DataSourceStorageService,
    private _activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    const dataSourceName = this._dataSourceStorageService.getStoredSource();
    if (dataSourceName) {
      this.setCurrentSource(dataSourceName);
    } else {
      this.dataSources.find(dataSources => {
        if (dataSources.isDefault) {
          this.setCurrentSource(dataSources.name);
        }
      });
    }
  }

  ngOnInit() {
    this._queryParamSubscription = this._activatedRoute.queryParamMap
      .pipe(map((params: ParamMap) => params.get('theme')))
      .subscribe((sourceName: string | null) => {
        if (sourceName) {
          this.setCurrentSource(sourceName);
        }
      });
  }

  ngOnDestroy() {
    this._queryParamSubscription.unsubscribe();
  }

  setCurrentSource(dataSourceName: string) {
    const dataSource =
      this.dataSources.find(
        currentDataSource => currentDataSource.name === dataSourceName
      ) ||
      this.dataSources.find(currentDataSource => currentDataSource.isDefault)!;

    this.currentDataSource = dataSource;

    if (dataSource.isDefault) {
      this.styleManagerService.removeStyle('theme');
    } else {
      this.styleManagerService.setStyle('theme', `${dataSource.cssName}.css`);
    }

    if (this.currentDataSource) {
      this._dataSourceStorageService.storeSource(this.currentDataSource);
    }
  }

  switchDataSource(dataSourceName: string) {
    this.setCurrentSource(dataSourceName);
    this.router.navigate(['/']);
  }
}
