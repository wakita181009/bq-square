import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';

declare let require: any;
let Plotly = require('plotly.js/lib/core');

Plotly.register([
  require('plotly.js/lib/pie'),
  require('plotly.js/lib/bar')
]);


@Component({
  selector: 'plotly-js-component',
  templateUrl: './plotly-js.component.html',
  styleUrls: ['./plotly-js.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlotlyJsComponent implements OnInit {

  @Input() data: any;

  plot_data: any;
  plot_title: any;
  plot_multi: boolean = false;

  constructor() {
  }

  single_layout = {
    title: this.plot_title,
    autosize: true
  };

  multi_layout = {
    title: this.plot_title,
    autosize: true,
    xaxis: {
      tickangle: 45
    },
    yaxis: {
      exponentformat: "none"
    },
    yaxis2: {
      side: 'right',
      overlaying: 'y',
      exponentformat: "none"
    }
  };

  get layout() {
    if (this.plot_multi) {
      return this.multi_layout
    } else {
      return this.single_layout
    }
  }


  @ViewChild("plotlychart") plotlychart: ElementRef;

  ngOnInit() {
    this.plot_data = this.data.result;
    this.plot_title = this.data.title;
    this.plot_multi = this.data.multi;
  }

  ngAfterViewInit() {
    setTimeout(() => Plotly.newPlot(this.plotlychart.nativeElement, this.plot_data, this.layout,
      {
        showLink: false,
        displaylogo: false,
        modeBarButtonsToRemove: ['sendDataToCloud', 'hoverCompareCartesian']
      }), 500)
  }

}
