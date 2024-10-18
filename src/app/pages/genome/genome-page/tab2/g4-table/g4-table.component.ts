import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { G4_MBGD } from '../../../Genome';
import { Subject, takeUntil } from 'rxjs';
import { GetG4Service } from './get-g4-data-api.service';
import { SlicePipe } from '@angular/common';
import { JbrowseService } from '../jbrowse/jbrowse.service';

@Component({
  selector: 'app-g4-table',
  standalone: true,
  imports: [NzTableModule, SlicePipe],
  templateUrl: './g4-table.component.html',
  styleUrl: './g4-table.component.scss',
})
export class G4TableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('virtualTable', { static: false })
  nzTableComponent?: NzTableComponent<G4_MBGD>;
  private destroy$ = new Subject<boolean>();
  listOfData: G4_MBGD[] = [];
  loading = true;

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

  onClick() {
    this.jbrowseService.setState('bbb');
  }

  ngOnInit(): void {
    this.getG4DataService
      .getG4Data('aaa', 'chromosome-1-1', 'c')
      .subscribe(data => {
        this.listOfData = data;
        this.loading = false;
        this.jbrowseService.setState('aaa');
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
}
