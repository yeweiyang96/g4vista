import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  input,
  OnInit,
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
export class JbrowseComponent implements OnDestroy, OnInit {
  @ViewChild(containerElementName, { static: true })
  containerRef!: ElementRef;
  // 配置选择物种的jbrowse的配置文件
  readonly abbreviation = input.required<string>();
  readonly chromosome = input.required<string>();
  root!: Root;

  ngOnInit(): void {
    this.render();
  }
  ngOnDestroy(): void {
    this.root.unmount();
  }
  private render() {
    if (!this.root) {
      this.root = createRoot(this.containerRef.nativeElement);
    }
    this.root.render(
      createElement(View, {
        locString: this.chromosome() + ':1..10000',
        assemblyName: this.abbreviation(),
      })
    );
  }
}
