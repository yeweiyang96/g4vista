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
import { ParsedLocString } from '@jbrowse/core/util';

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
  genome!: string;
  @Input()
  location!: ParsedLocString;
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
    this.root.render(createElement(View, {}));
  }
}
