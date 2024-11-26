import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { G4_MBGD } from '../../../Genome';
import { DataSourceStorageService } from '../../../../../shared/service/data-source-storage.service';
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private apiUrl = 'https://g4vista-api.med.niigata-u.ac.jp';

  constructor(
    private http: HttpClient,
    private dataSourceStorageService: DataSourceStorageService
  ) {}

  // 请求 gzip 压缩的 CSV 数据
  // getG4Arrow() // abbreviation: string,
  // chromosome: string,
  // type: string
  // : Observable<ArrowDB> {
  //   return from(
  //     ArrowDB.fromArrowFile(
  //       'https://media.githubusercontent.com/media/uwdata/flights-arrow/master/flights-10m.arrow'
  //     )
  //   );
  // const databaseName = this.dataSourceStorageService.getStoredSource();
  // return this.http.get(
  // `${this.apiUrl}/${databaseName}/g4/${abbreviation}/${chromosome}/${type}`,
  // 'https://media.githubusercontent.com/media/uwdata/flights-arrow/master/flights-10m.arrow',
  // {
  // responseType: 'blob',
  // }
  // ).pipe(map((data: Blob) => ArrowDB.fromArrowFile(data).));
  // }
}
