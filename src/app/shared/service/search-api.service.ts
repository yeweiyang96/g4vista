import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SearchResult } from '../dataclass/Search';
import { DataSourceStorageService } from './data-source-storage.service';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  private apiUrl = 'https://g4vista-api.med.niigata-u.ac.jp';

  constructor(
    private http: HttpClient,
    private dataSourceStorageService: DataSourceStorageService
  ) {}

  search_genome(search: string): Observable<SearchResult[]> {
    if (!search.trim()) {
      return of([]);
    } else if (search.length < 2) {
      return of([]);
    }
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http.get<SearchResult[]>(
      `${this.apiUrl}/${databaseName}/genome?item=${search} `
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
