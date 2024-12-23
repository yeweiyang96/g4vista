import {
  Component,
  OnInit,
  ViewChild,
  input,
  effect,
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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { G4 } from '../../../../../shared/dataclass/G4';

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
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './g4-table.component.html',
  styleUrl: './g4-table.component.scss',
})
export class G4TableComponent implements OnInit {
  @ViewChild('virtualTable', { static: false })
  nzTableComponent?: NzTableComponent<G4>;
  chromosome_name = input.required<string>();
  g4 = input.required<G4[]>();
  listOfData: G4[] = [];
  listOfDisplayData: G4[] = [];
  loading = true;
  // isOpen = false;
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
      width: 10,
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
      sortFn: (a: G4, b: G4) => a.TS - b.TS,
      listOfFilter: [
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
        { text: '6', value: '6' },
      ],
      filterMultiple: true,
      filterFn: (list: string[], item: G4) => list.some(v => item.TS === +v),
    },
    {
      name: 'G-Score',
      value: 'G-Score',
      default: true,
      width: 10,
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
      name: 'insideOf_genes_upstream_1k_plus',
      value: 'insideOf_genes_upstream_1k_plus',
      default: true,
      width: 100,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_gene_plus',
      value: 'insideOf_gene_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'partOverlapWith_gene_plus_upstreamEnd',
      value: 'partOverlapWith_gene_plus_upstreamEnd',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'partOverlapWith_gene_plus_downstreamEnd',
      value: 'partOverlapWith_gene_plus_downstreamEnd',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_2k_plus',
      value: 'insideOf_genes_upstream_2k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_3k_plus',
      value: 'insideOf_genes_upstream_3k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_4k_plus',
      value: 'insideOf_genes_upstream_4k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_5k_plus',
      value: 'insideOf_genes_upstream_5k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_1k_plus',
      value: 'insideOf_genes_downstream_1k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_2k_plus',
      value: 'insideOf_genes_downstream_2k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_3k_plus',
      value: 'insideOf_genes_downstream_3k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_4k_plus',
      value: 'insideOf_genes_downstream_4k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_5k_plus',
      value: 'insideOf_genes_downstream_5k_plus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_gene_minus',
      value: 'insideOf_gene_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'partOverlapWith_gene_minus_upstreamEnd',
      value: 'partOverlapWith_gene_minus_upstreamEnd',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'partOverlapWith_gene_minus_downstreamEnd',
      value: 'partOverlapWith_gene_minus_downstreamEnd',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_1k_minus',
      value: 'insideOf_genes_upstream_1k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_2k_minus',
      value: 'insideOf_genes_upstream_2k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_3k_minus',
      value: 'insideOf_genes_upstream_3k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_4k_minus',
      value: 'insideOf_genes_upstream_4k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_upstream_5k_minus',
      value: 'insideOf_genes_upstream_5k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_1k_minus',
      value: 'insideOf_genes_downstream_1k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_2k_minus',
      value: 'insideOf_genes_downstream_2k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_3k_minus',
      value: 'insideOf_genes_downstream_3k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_4k_minus',
      value: 'insideOf_genes_downstream_4k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
    {
      name: 'insideOf_genes_downstream_5k_minus',
      value: 'insideOf_genes_downstream_5k_minus',
      default: false,
      width: 150,
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true,
    },
  ];

  constructor(
    private jbrowseService: JbrowseService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      this.loading = false;
      this.listOfDisplayData = this.listOfData = this.g4();
    });
  }

  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }

  trackByIndex(_: number, data: G4): number {
    return data.T1;
  }

  onClick(location: string) {
    this.jbrowseService.setState(this.chromosome_name() + ':' + location);
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

  searchValue1 = '';
  searchValue = '';
  visible1 = false;
  visible = false;

  reset(): void {
    this.searchValue1 = '';
    this.search();
  }

  search(): void {
    this.visible1 = false;
    this.listOfDisplayData = this.listOfData.filter((item: G4) => {
      if (item.insideOf_genes_upstream_1k_plus) {
        return (
          item.insideOf_genes_upstream_1k_plus.indexOf(this.searchValue1) !== -1
        );
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
