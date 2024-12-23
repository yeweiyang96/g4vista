import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataSourceStorageService } from '../../../shared/service/data-source-storage.service';
import { map, Observable } from 'rxjs';
import { GenomeInfo } from '../../../shared/dataclass/Genome';
import { Chromosome } from '../../../shared/dataclass/Chromosome';
import Papa from 'papaparse';
import { G4 } from '../../../shared/dataclass/G4';
import { Gene } from '../../../shared/dataclass/Gene';
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
      `${this.apiUrl}/${databaseName}/${abbreviation} `
    );
  }
  get_chromosome(
    abbreviation: string,
    chromosome: string,
    g4_type: string
  ): Observable<Chromosome> {
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http.get<Chromosome>(
      `${this.apiUrl}/${databaseName}/${abbreviation}/${chromosome}?gc=${g4_type}`
    );
  }
  getG4Data(
    abbreviation: string,
    chromosome: string,
    type: string
  ): Observable<G4[]> {
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http
      .get(
        `${this.apiUrl}/${databaseName}/g4/${abbreviation}/${chromosome}?gc=${type}`,
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
  getGene(
    abbreviation: string,
    chromosome: string,
    gene: string = '-1'
  ): Observable<Gene> {
    const databaseName = this.dataSourceStorageService.getStoredSource();
    return this.http.get<Gene>(
      `${this.apiUrl}/${databaseName}/${abbreviation}/${chromosome}/${gene}`
    );
  }
}
