import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataSourceStorageService } from '../../../shared/service/data-source-storage.service';
import { Observable } from 'rxjs';
import { GenomeInfo } from '../Genome';
@Injectable({
  providedIn: 'root',
})
export class GetGenomeService {
  private apiUrl = 'https://g4vista-api.med.niigata-u.ac.jp';

  constructor(
    private http: HttpClient,
    private dataSourceStorageService: DataSourceStorageService
  ) {}

  get_genome(abbreviation: string): Observable<GenomeInfo> {
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http.get<GenomeInfo>(
      `${this.apiUrl}/${databaseName}/genome/${abbreviation} `
    );
  }
}
