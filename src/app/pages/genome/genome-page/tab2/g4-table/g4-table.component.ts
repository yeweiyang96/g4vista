import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NzTableComponent,
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { G4_MBGD } from '../../../Genome';
import { Subject, takeUntil } from 'rxjs';
import { GetG4Service } from './get-g4-data-api.service';
import { SlicePipe } from '@angular/common';
import { JbrowseService } from '../jbrowse/jbrowse.service';
import { OverlayModule } from '@angular/cdk/overlay';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<G4_MBGD> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<G4_MBGD> | null;
}

@Component({
  selector: 'app-g4-table',
  standalone: true,
  imports: [
    NzTableModule,
    SlicePipe,
    OverlayModule,
    NzDropDownModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './g4-table.component.html',
  styleUrl: './g4-table.component.scss',
})
export class G4TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('virtualTable', { static: false })
  nzTableComponent?: NzTableComponent<G4_MBGD>;
  @Input()
  abbreviation!: string;
  @Input()
  locString!: string;
  private destroy$ = new Subject<boolean>();
  listOfData: G4_MBGD[] = [];
  listOfDisplayData: G4_MBGD[] = [];
  loading = true;
  chromosome = 'chromosome-1-1';
  isOpen = false;
  type = 'g';

  constructor(
    private getG4DataService: GetG4Service,
    private jbrowseService: JbrowseService
  ) {}

  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }

  trackByIndex(_: number, data: G4_MBGD): number {
    return data.T1;
  }

  onClick(location: string) {
    this.jbrowseService.setState(this.chromosome + ':' + location);
  }

  ngOnInit(): void {
    this.getG4DataService
      .getG4Data(this.abbreviation, this.chromosome, this.type)
      .subscribe(data => {
        this.listOfData = data;
        this.listOfDisplayData = [...this.listOfData];
        this.loading = false;
        this.jbrowseService.setState(this.abbreviation);
      });
  }

  ngAfterViewInit(): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        console.log('scroll index to', data);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  searchValue = '';
  visible = false;

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    console.log(this.searchValue);
    console.log(this.listOfDisplayData);
    this.listOfDisplayData = this.listOfData.filter((item: G4_MBGD) => {
      console.log(item.gene);
      return;
      item.gene.indexOf(this.searchValue) !== -1;
    });
  }
}
