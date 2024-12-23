import {
  map,
  Observable,
  startWith,
  distinctUntilChanged,
  throwError,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chromosome } from './../../../../shared/dataclass/Chromosome';
import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
  OnDestroy,
  inject,
  OnInit,
  input,
  signal,
  DestroyRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { G4TableComponent } from './g4-table/g4-table.component';
import { JbrowseComponent } from './jbrowse/jbrowse.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgStyle } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { GetGenomeService } from '../get-genome-info-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { G4 } from '../../../../shared/dataclass/G4';
import { JbrowseService } from './jbrowse/jbrowse.service';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [
    G4TableComponent,
    CdkDrag,
    JbrowseComponent,
    CdkDragHandle,
    MatButtonModule,
    MatIconModule,
    NgStyle,
    ChartComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatListModule,
    MatInputModule,
    AsyncPipe,
    NzSkeletonModule,
  ],
  templateUrl: './tab2.component.html',
  styleUrl: './tab2.component.scss',
})
export class Tab2Component implements AfterViewInit, OnDestroy, OnInit {
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  @ViewChild(TemplateRef) _dialogTemplate!: TemplateRef<unknown>;
  private _overlayRef!: OverlayRef;
  private _portal!: TemplatePortal;
  isOpen = false;

  readonly abbreviation = input.required<string>();
  readonly chromosome_list = input.required<string[]>();
  readonly selected_chromosome = input.required<string>();
  g4_type: FormControl = new FormControl('g');
  chromosomeList$!: Observable<string[]>;
  chromosome!: Chromosome;
  g4_data!: G4[];
  isG4 = signal(false);

  chromosome_filter: FormControl = new FormControl('');
  current_chromosome!: string;

  private _snackBar = inject(MatSnackBar);
  destroyRef = inject(DestroyRef);

  constructor(
    private getGenomeService: GetGenomeService,
    private jbrowseService: JbrowseService
  ) {}

  ngOnInit() {
    // default value
    this.current_chromosome = this.selected_chromosome();
    // subscribe to the value change of the chromosome filter
    this.chromosomeList$ = this.chromosome_filter.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
      map(value => this._filter(value || ''))
    );
    this.g4_type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('g4 type changed');
        this.getG4();
      });

    this.getG4();
  }

  // filter the chromosome list by serching
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (value == '') {
      return this.chromosome_list();
    }
    return this.chromosome_list().filter(option => {
      return option.toLowerCase().includes(filterValue);
    });
  }

  ngAfterViewInit() {
    this._portal = new TemplatePortal(
      this._dialogTemplate,
      this._viewContainerRef
    );
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: false,
    });
  }

  ngOnDestroy() {
    this._overlayRef.detach();
    this._overlayRef.dispose();
  }

  openJbrowse() {
    if (!this._overlayRef.hasAttached()) {
      this._overlayRef.attach(this._portal);
    }
    if (!this.isOpen) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  changeChromosome(chromosome: string) {
    this.current_chromosome = chromosome;
    this.jbrowseService.setState(chromosome + ':1..10000');
    this.getG4();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  getG4Data() {
    this.getGenomeService
      .getG4Data(
        this.abbreviation(),
        this.current_chromosome,
        this.g4_type.value
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.isG4.set(false);
          return throwError(() => new Error('Oops! No G4 data found.'));
        })
      )
      .subscribe(response => {
        this.isG4.set(true);
        this.g4_data = response;
      });
  }
  getG4() {
    this.isG4.set(false);
    this.getGenomeService
      .get_chromosome(
        this.abbreviation(),
        this.current_chromosome,
        this.g4_type.value
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.isG4.set(false);
          this.openSnackBar('No Chromosome found', 'Close');
          return throwError(
            () =>
              new Error('Oops! Something went wrong. Please try again later.')
          );
        })
      )
      .subscribe(data => {
        if (data.g4_count > 0) {
          this.chromosome = data;
          this.getG4Data();
        } else {
          this.isG4.set(false);
          this.openSnackBar(
            'No G4 data found in ' +
              data.chromosome +
              '(' +
              this.g4_type.value.toUpperCase() +
              '-Rich)',
            'Close'
          );
        }
      });
  }
}
