import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NzTableComponent,
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder,
  NzCustomColumn,
} from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { G4_MBGD } from '../../../Genome';
import { Subject, takeUntil } from 'rxjs';
import { GetG4Service } from './get-g4-data-api.service';
import { SlicePipe } from '@angular/common';
import { JbrowseService } from '../jbrowse/jbrowse.service';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<G4_MBGD> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<G4_MBGD> | null;
}

interface CustomColumn extends NzCustomColumn {
  name: string;
  required?: boolean;
  position?: 'left' | 'right';
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
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    CdkDrag,
    CdkDropList,
    MatIconModule,
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

  isVisible: boolean = false;
  title: CustomColumn[] = [];
  footer: CustomColumn[] = [];
  fix: CustomColumn[] = [];
  notFix: CustomColumn[] = [];

  customColumn: CustomColumn[] = [
    {
      name: 'Start',
      value: 'Start',
      default: true,
      required: true,
      position: 'left',
      width: 10,
      fixWidth: true,
    },
    {
      name: 'End',
      value: 'End',
      default: true,
      width: 100,
    },
    {
      name: 'Number of tetrads',
      value: 'Number of tetrads',
      default: true,
      width: 100,
    },
    {
      name: 'G-Score',
      value: 'G-Score',
      default: true,
      width: 100,
    },
    {
      name: 'SEQ',
      value: 'SEQ',
      default: true,
      width: 100,
    },
    {
      name: "insideOf_genes'upstream_1k(+)",
      value: "insideOf_genes'upstream_1k(+)",
      default: true,
      width: 100,
    },
  ];

  constructor(
    private getG4DataService: GetG4Service,
    private jbrowseService: JbrowseService,
    private cdr: ChangeDetectorRef
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
    this.title = this.customColumn.filter(
      item => item.position === 'left' && item.required
    );
    this.footer = this.customColumn.filter(
      item => item.position === 'right' && item.required
    );
    this.fix = this.customColumn.filter(item => item.default && !item.required);
    this.notFix = this.customColumn.filter(
      item => !item.default && !item.required
    );
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
    this.listOfDisplayData = this.listOfData.filter((item: G4_MBGD) => {
      if (item.gene) {
        return item.gene.indexOf(this.searchValue) !== -1;
      }
      return false;
    });
  }

  drop(event: CdkDragDrop<CustomColumn[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.fix = this.fix.map(item => {
      item.default = true;
      return item;
    });
    this.notFix = this.notFix.map(item => {
      item.default = false;
      return item;
    });
    this.cdr.markForCheck();
  }

  deleteCustom(value: CustomColumn, index: number): void {
    value.default = false;
    this.notFix = [...this.notFix, value];
    this.fix.splice(index, 1);
    this.cdr.markForCheck();
  }

  addCustom(value: CustomColumn, index: number): void {
    value.default = true;
    this.fix = [...this.fix, value];
    this.notFix.splice(index, 1);
    this.cdr.markForCheck();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.customColumn = [
      ...this.title,
      ...this.fix,
      ...this.notFix,
      ...this.footer,
    ];
    this.isVisible = false;
    this.cdr.markForCheck();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
