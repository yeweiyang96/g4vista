import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { G4 } from '../../../../../shared/dataclass/G4';
import { Subject } from 'rxjs';
import { GetG4Service } from './get-g4-data-api.service';
import { JbrowseService } from '../jbrowse/jbrowse.service';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Chromosome } from '../../../../../shared/dataclass/Chromosome';

interface CustomColumn extends NzCustomColumn {
  name: string;
  required?: boolean;
  position?: 'left' | 'right';
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<G4> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<G4> | null;
  filterMultiple: boolean;
}

@Component({
  selector: 'app-g4-table',
  standalone: true,
  imports: [
    NzTableModule,
    NzIconModule,
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './g4-table.component.html',
  styleUrl: './g4-table.component.scss',
})
export class G4TableComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('virtualTable', { static: false })
  nzTableComponent?: NzTableComponent<G4>;
  @Input()
  abbreviation!: string;
  @Input()
  chromosome!: Chromosome;
  @Input() g4_type = 'g';
  private destroy$ = new Subject<boolean>();
  listOfData: G4[] = [];
  listOfDisplayData: G4[] = [];
  loading = true;
  isOpen = false;
  // 跳转值
  scrollIndex = 1;

  // 自定义列
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
      width: 100,
      fixWidth: true,
      sortOrder: null,
      sortFn: (a: G4, b: G4) => a.T1 - b.T1,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'End',
      value: 'End',
      default: true,
      width: 100,
      sortOrder: null,
      sortFn: (a: G4, b: G4) => a.T4 + a.TS - (b.T4 + b.TS),
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'Number of tetrads',
      value: 'Number of tetrads',
      default: true,
      width: 100,
      sortOrder: null,
      sortFn: (a: G4, b: G4) => a.T1 - b.T1,
      listOfFilter: [
        { text: '2', value: '2' },
        { text: '3', value: '3' },
      ],
      filterMultiple: true,
      filterFn: (list: string[], item: G4) => list.some(v => item.TS === +v),
    },
    {
      name: 'G-Score',
      value: 'G-Score',
      default: true,
      width: 100,
      sortOrder: null,
      sortFn: (a: G4, b: G4) => a.GS - b.GS,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'SEQ',
      value: 'SEQ',
      default: true,
      width: 100,
      sortOrder: null,
      sortFn: (a: G4, b: G4) => a.T1 - b.T1,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: "insideOf_genes'upstream_1k(+)",
      value: "insideOf_genes'upstream_1k(+)",
      default: false,
      width: 100,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
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

  trackByIndex(_: number, data: G4): number {
    return data.T1;
  }

  onClick(location: string) {
    this.jbrowseService.setState(this.chromosome + ':' + location);
  }

  ngOnInit(): void {
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
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (
      changes['g4_type'] ||
      changes['chromosome'] ||
      changes['abbreviation']
    ) {
      this.getG4DataService
        .getG4Data(this.abbreviation, this.chromosome.name, this.g4_type)
        .subscribe(data => {
          this.listOfData = data;
          this.listOfDisplayData = data;
          this.loading = false;
          this.cdr.markForCheck(); // 手动检查变化, 使得数据更新
          this.jbrowseService.setState(this.abbreviation);
        });
    }
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
    this.listOfDisplayData = this.listOfData.filter((item: G4) => {
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
