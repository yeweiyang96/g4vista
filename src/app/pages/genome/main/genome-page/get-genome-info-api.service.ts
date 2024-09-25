import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DataSourceStorageService } from '../../../../shared/service/data-source-storage.service';
import { Observable, of } from 'rxjs';
import { GenomeInfo } from './Genome';
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
  search_gene(search: string[]): Observable<string[]> {
    if (!search[1].trim()) {
      return of([]);
    } else if (search[1].length < 2) {
      return of([]);
    }
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http.get<string[]>(
      `${this.apiUrl}/${databaseName}/gene/?genome=${search[0]},search=${search[1]} `
    );
  }
}
