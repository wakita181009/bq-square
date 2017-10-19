import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {CHARTJS_OPTIONS} from './chartjs_options';


function thousandsSeparator(value, index, values) {
  value = value.toString().split(/(?=(?:...)*$)/).join(',');
  return value;
}

@Component({
  selector: 'chart-js-component',
  templateUrl: './chart-js.component.html',
  styleUrls: ['./chart-js.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartJsComponent implements OnInit {

  @Input() data: any;

  get_options(type, multi_axis = false) {
    if (type === 'line') {
      return multi_axis ? CHARTJS_OPTIONS['line_multi_axis'] : CHARTJS_OPTIONS['line']
    }
    return CHARTJS_OPTIONS[type] || {}
  }

  // colors = [
  //   // { // grey
  //   //   backgroundColor: 'rgba(148,159,177,0.2)',
  //   //   borderColor: 'rgba(148,159,177,1)',
  //   //   pointBackgroundColor: 'rgba(148,159,177,1)',
  //   //   pointBorderColor: '#fff',
  //   //   pointHoverBackgroundColor: '#fff',
  //   //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   // },
  //   {
  //     backgroundColor: 'rgba(167,226,222,0.2)',
  //     borderColor: 'rgba(167,226,222,1)'
  //   },
  //   {
  //     backgroundColor: 'rgba(224,208,157,0.2)',
  //     borderColor: 'rgba(224,208,157,1);'
  //   },
  // ];


  constructor() {
  }

  ngOnInit() {
  }

}
