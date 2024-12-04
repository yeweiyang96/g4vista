import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { View } from 'vega';
import embed from 'vega-embed';
// import { ChartService } from './chart.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  @Input() vegaSpec!: object; // Vega JSON specification
  @Input() data!: object; // Data to display in viewer
  showData = false; // Controls visibility of data viewer
  view!: View; // Vega view instance

  constructor() {}

  ngOnInit(): void {
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
        {
          name: 'tetrads',
          value: 0,
          bind: {
            input: 'select',
            options: [0, 2, 3, 4, 5],
            labels: ['All', '2', '3', '4', '5'],
          },
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
              type: 'filter',
              expr: 'tetrads == 0 || datum.TS == tetrads',
            },
            {
              type: 'bin',
              field: 'T1',
              extent: [0, 2700000],
              step: { signal: 'binStep' },
              nice: false,
              as: ['start', 'end'],
            },
            {
              type: 'aggregate',
              groupby: ['start', 'end'],
              fields: ['T1', 'GS'],
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
        {
          name: 'colorScale',
          type: 'linear',
          domain: { data: 'binned', field: 'mean_score' },
          range: ['#1a9850', '#fee08b', '#d73027'], // 绿-黄-红渐变
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
              x: { scale: 'xscale', field: 'start' },
              x2: { scale: 'xscale', field: 'end' },
              y: { scale: 'yscale', field: 'count' },
              y2: { scale: 'yscale', value: 0 },
              fill: { scale: 'colorScale', field: 'mean_score' },
              tooltip: {
                signal:
                  "{'Region Start': datum.start, 'Region End': datum.end, 'Count': datum.count, 'Avg Score': format(datum.mean_score, '.2f')}",
              },
            },
            hover: {
              fill: { value: 'blue' },
            },
          },
        },
      ],
    };
    if (this.vegaSpec) {
      embed('#vega-view', this.vegaSpec, {
        actions: {
          export: true, // 允许导出图表为 PNG/SVG
          source: false, // 查看图表的 Vega JSON
          compiled: true, // 查看编译后的 Vega-Lite（如果适用）
          editor: false, // 打开 Vega Editor
        },
      })
        .then(result => {
          this.view = result.view; // 获取 Vega view 实例
        })
        .catch(console.error);
    }
  }

  toggleDataViewer() {
    this.showData = !this.showData;
  }

  // 将数据转换为 TSV 格式
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  convertToTSV(data: any[]): string {
    if (!data.length) return ''; // 如果数据为空，返回空字符串

    const keys = Object.keys(data[0]); // 获取数据的列名
    const rows = data.map(
      row => keys.map(key => row[key]).join('\t') // 将每行数据拼接为 TSV 格式
    );
    return [keys.join('\t'), ...rows].join('\n'); // 拼接列名和行数据
  }
  exportTsv() {
    const chartData = this.view.data('binned');
    const tsvData = this.convertToTSV(chartData);
    console.log(chartData);
    const blob = new Blob([tsvData], {
      type: 'text/tab-separated-values',
    });
    const tsvUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = tsvUrl;
    a.download = 'Histogram.tsv';
    a.click();
    a.remove();
    URL.revokeObjectURL(tsvUrl);
  }
}
