import { Chromosome } from './../../../../shared/dataclass/Chromosome';
import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
  OnDestroy,
  inject,
  Input,
  OnInit,
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

  @Input() abbreviation = '';
  chromosome!: Chromosome;
  g4_type: FormControl = new FormControl('g');
  locString = 'chromosome-1-1:1..1000';
  data = {};
  @Input()
  chromosomeList: Chromosome[] = [];

  ngOnInit() {
    console.log('init');

    this.chromosome = {
      name: 'chromosome-1-1',
      length: 5482170,
      g4_tetreds: ['2', '3', '4', '5'],
    };
    this.chromosomeList = [this.chromosome, this.chromosome, this.chromosome];
    // this.chromosome = this.chromosomeList[0];
    // this.locString = this.chromosomeList[0].name+':1..1000';
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
    this._overlayRef.attach(this._portal);
    // click outside to close
    // this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
  }

  ngOnDestroy() {
    this._overlayRef.detach();
    this._overlayRef.dispose();
  }

  openDialog() {
    if (!this.isOpen) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  changeChromosome(chromosome: Chromosome) {
    this.chromosome = chromosome;
  }
}
