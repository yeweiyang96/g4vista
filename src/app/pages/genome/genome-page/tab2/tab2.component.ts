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

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [G4TableComponent, CdkDrag, JbrowseComponent, CdkDragHandle],
  templateUrl: './tab2.component.html',
  styleUrl: './tab2.component.scss',
})
export class Tab2Component implements AfterViewInit, OnDestroy {
  private _overlay = inject(Overlay);
  private _viewContainerRef = inject(ViewContainerRef);
  @Input() abbreviation = '';
  locString = 'chromosome-5-215:2..1,000';
  @ViewChild(TemplateRef) _dialogTemplate!: TemplateRef<unknown>;
  private _overlayRef!: OverlayRef;
  private _portal!: TemplatePortal;
  isOpen = false;

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
    this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
  }

  ngOnDestroy() {
    this._overlayRef.dispose();
  }

  openDialog(isOpen: boolean) {
    if (isOpen) {
      this._overlayRef.attach(this._portal);
    } else {
      this._overlayRef.detach();
    }
  }
}
