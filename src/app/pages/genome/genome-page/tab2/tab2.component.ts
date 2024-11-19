import {
  Component,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ViewContainerRef,
  OnDestroy,
  inject,
  Input,
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
  ],
  templateUrl: './tab2.component.html',
  styleUrl: './tab2.component.scss',
})
export class Tab2Component implements AfterViewInit, OnDestroy {
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  @ViewChild(TemplateRef) _dialogTemplate!: TemplateRef<unknown>;
  private _overlayRef!: OverlayRef;
  private _portal!: TemplatePortal;
  isOpen = false;

  @Input() abbreviation = '';
  locString = 'chromosome-1-1:1..5,482,170';

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
    // click outside to close
    // this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
  }

  ngOnDestroy() {
    this._overlayRef.dispose();
  }

  openDialog(isOpen: boolean) {
    if (isOpen) {
      this._overlayRef.attach(this._portal);
    } else {
      isOpen = false;
    }
  }
}
