import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import View from './view';
const containerElementName = 'jbrowse_linear_genome_view';

@Component({
  selector: 'app-jbrowse',
  standalone: true,
  imports: [],
  templateUrl: './jbrowse.component.html',
  styleUrl: './jbrowse.component.scss',
})
export class JbrowseComponent implements OnChanges, AfterViewInit, OnDestroy {
  constructor() {}
  @ViewChild(containerElementName, { static: true })
  containerRef!: ElementRef;
  // 配置选择物种的jbrowse的配置文件
  @Input()
  abbreviation!: string;
  @Input()
  locString!: string;
  root!: Root;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change', changes);
    this.render();
  }

  ngAfterViewInit(): void {
    console.log('after');
    this.render();
  }
  ngOnDestroy(): void {
    console.log('destroy');
    this.root.unmount();
  }
  private render() {
    if (!this.root) {
      this.root = createRoot(this.containerRef.nativeElement);
    }
    console.log('render:', this.abbreviation);
    this.abbreviation = 'aaa';
    this.root.render(
      createElement(View, {
        locString: this.locString,
        assemblyName: this.abbreviation,
      })
    );
  }
}
