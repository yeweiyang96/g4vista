import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Papa from 'papaparse';
import { G4 } from '../../../../../shared/dataclass/G4';
import { DataSourceStorageService } from '../../../../../shared/service/data-source-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GetG4Service {
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
          });
          return result.data; // 返回解析后的对象数组
        })
      );
  }
}
