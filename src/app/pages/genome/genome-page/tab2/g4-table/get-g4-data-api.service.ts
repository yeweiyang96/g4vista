import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Papa from 'papaparse';
import { G4 } from '../../../../../shared/dataclass/G4';
import { DataSourceStorageService } from '../../../../../shared/service/data-source-storage.service';
import { GeneLocation } from '../../../../../shared/dataclass/Gene';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private apiUrl = 'https://g4vista-api.med.niigata-u.ac.jp';

  constructor(
    private http: HttpClient,
    private dataSourceStorageService: DataSourceStorageService
  ) {}

  // 请求 gzip 压缩的 CSV 数据
  getG4Data(
    abbreviation: string,
    chromosome: string,
    type: string
  ): Observable<G4[]> {
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http
      .get(
        `${this.apiUrl}/${databaseName}/g4/${abbreviation}/${chromosome}/${type}`,
        {
          responseType: 'text',
        }
      )
      .pipe(
        map((csvData: string) => {
          // 使用 PapaParse 解析 CSV 数据
          const result = Papa.parse<G4>(csvData, {
            header: true, // 表示第一行为标题
            skipEmptyLines: true, // 跳过空行
            dynamicTyping: true, // 自动转换数据类型
            transformHeader: function (header) {
              // 移除引号和括号
              const newHeader = header
                .replace(/'/g, '_')
                .replace(/\(\+\)/g, '_plus')
                .replace(/\(-\)/g, '_minus');

              return newHeader;
            },
          });
          return result.data; // 返回解析后的对象数组
        })
      );
  }
  getGeneLocation(
    abbr: string,
    chr: string,
    gene: string
  ): Observable<GeneLocation> {
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http.get<GeneLocation>(
      `${this.apiUrl}/${databaseName}/${abbr}/${chr}/${gene}/location`
    );
  }
}
