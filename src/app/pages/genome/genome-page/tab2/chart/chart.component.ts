import { Component, ElementRef, OnInit, ViewChild, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { View } from 'vega';
import embed from 'vega-embed';
import { Chromosome } from '../../../../../shared/dataclass/Chromosome';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { G4 } from '../../../../../shared/dataclass/G4';
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ScrollingModule,
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  view!: View; // Vega view instance
  @ViewChild('vega') vegaView!: ElementRef;
  readonly g4 = input.required<G4[]>();
  readonly chromosome = input.required<Chromosome>();

  // url = 'https://g4vista-api.med.niigata-u.ac.jp/mbgd/g4/';
  defaultStepSize = 10000;
  toppings: FormControl = new FormControl(); //响应式表单的方法来双向绑定选择的stepList的值
  isLoading = true;
  stepSizeFormControl: FormControl = new FormControl();
  lastScrollRight = 0;
  lastScrollLeft = 0;

  vegaSpec(chr: Chromosome, g4: G4[]): object {
    return {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description:
        'Interactive histogram of G4 sequence distribution along the chromosome.',
      width: 1000,
      height: 300,
      autosize: {
        type: 'pad',
        // resize: true,
        contains: 'padding',
      },
      padding: 5,
      title: {
        text: 'Distribution of G4 Sequences on the ' + chr.chromosome, // 图表标题
        anchor: 'center', // 标题对齐方式（start: 左对齐）
        fontSize: 20, // 标题字体大小
        font: 'Roboto', // 标题字体
        dy: 0, // 标题的垂直偏移
      },

      signals: [
        // 绑定到外部滑块
        {
          name: 'binStep1',
          bind: {
            element: '#binStepSlider',
          },
        },
        {
          name: 'tetrads',
          value: chr.layers_list,
        },
      ],
      data: [
        {
          name: 'g4_data',
          values: g4,
        },
        {
          name: 'binned',
          source: 'g4_data',
          transform: [
            {
              type: 'filter',
              expr: 'indexof(tetrads, datum.TS) > -1',
            },
            {
              type: 'bin',
              field: 'T1',
              extent: [1, chr.length],
              step: { signal: 'binStep1' },
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
          domain: [1, chr.length],
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
        {
          orient: 'bottom',
          scale: 'xscale',
          title: 'Chromosome Region',
          titleFontSize: 14, // X轴标题字体大小
          titleFont: 'Arial', // X轴标题字体
          titleFontWeight: 'bold', // X轴标题字体粗细
          labelFontSize: 12, // X轴刻度标签字体大小
          labelFont: 'Arial',
        },
        {
          orient: 'left',
          scale: 'yscale',
          title: 'G4 Count',
          titleFontSize: 14, // X轴标题字体大小
          titleFont: 'Arial', // X轴标题字体
          titleFontWeight: 'bold', // X轴标题字体粗细
          labelFontSize: 12, // X轴刻度标签字体大小
          labelFont: 'Arial',
        },
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
              stroke: { value: 'black' }, // 边框颜色
              strokeWidth: { value: 1 },
            },
            hover: {
              fill: { value: 'blue' },
            },
          },
        },
      ],
      legends: [
        {
          fill: 'colorScale', // 绑定颜色比例尺
          title: 'Mean Score', // 图例标题
          orient: 'right', // 图例位置
          titleFont: 'Arial', // 图例标题字体
          titleFontSize: 14, // 图例标题字体大小
          labelFont: 'Arial', // 图例标签字体
          labelFontSize: 12, // 图例标签字体大小
        },
      ],
    };
  }

  constructor() {}

  ngOnInit(): void {
    this.toppings.setValue(this.chromosome().layers_list);
    this.init_vega(this.chromosome(), this.g4());
  }

  init_vega(chr: Chromosome, g4: G4[]): void {
    this.defaultStepSize = Math.ceil(chr.length / 100);
    const vegaSpec = this.vegaSpec(chr, g4);
    this.stepSizeFormControl = new FormControl(this.defaultStepSize, [
      Validators.min(1),
      Validators.max(chr.length),
      Validators.required,
      // eslint-disable-next-line no-useless-escape
      Validators.pattern(/^\d+$/), // 正整数验证
    ]);
    embed('#vega-view', vegaSpec, {
      actions: {
        export: true, // 允许导出图表为 PNG/SVG
        source: false, // 查看图表的 Vega JSON
        compiled: false, // 查看编译后的 Vega-Lite（如果适用）
        editor: false, // 打开 Vega Editor
      },
    })
      .then(result => {
        this.view = result.view;
        this.isLoading = false;
      })
      .catch(console.error);
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

  onSelectChange() {
    this.view.signal('tetrads', this.toppings.value).run();
  }

  onWheel(event: WheelEvent): void {
    // 检查滚动边界
    const atLeft = this.vegaView.nativeElement.scrollLeft === 0;
    const atRight =
      this.vegaView.nativeElement.scrollLeft +
        this.vegaView.nativeElement.clientWidth >=
      this.vegaView.nativeElement.scrollWidth;

    // 到达边界时恢复默认滚动
    if ((atLeft && event.deltaY < 0) || (atRight && event.deltaY > 0)) {
      // console.log('滚到头');
      return;
    } else {
      // console.log('左右滚动');
      event.preventDefault(); // 阻止默认垂直滚动
      this.vegaView.nativeElement.scrollLeft += event.deltaY; // 横向滚动
    }
  }
}
