import { Component, Input, OnInit } from '@angular/core';
import embed from 'vega-embed';
// import { ChartService } from './chart.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  @Input() vegaSpec!: object; // Vega JSON specification
  @Input() data!: object; // Data to display in viewer
  showData = false; // Controls visibility of data viewer

  constructor() {
    this.vegaSpec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description:
        'Interactive histogram of G4 sequence distribution along the chromosome.',
      width: 800,
      height: 300,
      padding: 0,
      signals: [
        {
          name: 'binStep',
          value: 50000,
          bind: { input: 'range', min: 10000, max: 200000, step: 10000 },
        },
      ],
      data: [
        {
          name: 'g4_data',
          url: 'https://firebasestorage.googleapis.com/v0/b/g4vista.appspot.com/o/eft_c_chromosome-1-1.csv?alt=media&token=c9f24577-ba41-4427-a499-033ee3b569ff',
          format: { type: 'csv' },
        },
        {
          name: 'binned',
          source: 'g4_data',
          transform: [
            {
              type: 'bin',
              field: 'T1',
              extent: [0, 2700000],
              step: { signal: 'binStep' },
              nice: false,
            },
            {
              type: 'aggregate',
              groupby: ['bin0', 'bin1'],
              fields: ['GS', 'GS'],
              ops: ['count', 'mean'],
              as: ['count', 'mean_score'],
            },
          ],
        },
      ],
      scales: [
        {
          name: 'xscale',
          type: 'linear',
          range: 'width',
          domain: [0, 2700000],
        },
        {
          name: 'yscale',
          type: 'linear',
          range: 'height',
          domain: { data: 'binned', field: 'count' },
          zero: true,
          nice: true,
        },
      ],
      axes: [
        { orient: 'bottom', scale: 'xscale', title: 'Chromosome Region' },
        { orient: 'left', scale: 'yscale', title: 'G4 Count' },
      ],
      marks: [
        {
          type: 'rect',
          from: { data: 'binned' },
          encode: {
            update: {
              x: { scale: 'xscale', field: 'bin0' },
              x2: { scale: 'xscale', field: 'bin1' },
              y: { scale: 'yscale', field: 'count' },
              y2: { scale: 'yscale', value: 0 },
              fill: { value: 'steelblue' },
              tooltip: {
                signal:
                  "{'Region Start': datum.bin0, 'Region End': datum.bin1, 'Count': datum.count, 'Avg Score': format(datum.mean_score, '.2f')}",
              },
            },
            hover: {
              fill: { value: 'firebrick' },
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    if (this.vegaSpec) {
      embed('#vega-view', this.vegaSpec, {
        actions: {
          export: true, // 允许导出图表为 PNG/SVG
          source: true, // 查看图表的 Vega JSON
          compiled: true, // 查看编译后的 Vega-Lite（如果适用）
          editor: false, // 打开 Vega Editor
        },
      })
        .then(result => console.log('Vega chart rendered:', result))
        .catch(console.error);
    }
  }

  toggleDataViewer() {
    this.showData = !this.showData;
  }
}
