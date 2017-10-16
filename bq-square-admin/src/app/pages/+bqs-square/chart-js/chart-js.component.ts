import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';


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

  options_multi = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      yAxes: [
        {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "left",
          id: "y-axis-1",
          ticks: {
            beginAtZero: true,
            userCallback: thousandsSeparator //カンマ区切りのコールバック関数を指定
          }
        },
        {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "right",
          id: "y-axis-2",
          ticks: {
            beginAtZero: true,
            userCallback: thousandsSeparator //カンマ区切りのコールバック関数を指定
          },

          // grid line settings
          gridLines: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }
      ]
    }
  };

  options = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      yAxes: [
        {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "left",
          id: "y-axis-1",
          ticks: {
            beginAtZero: true,
            userCallback: thousandsSeparator //カンマ区切りのコールバック関数を指定
          }
        }
      ]
    }
  };

  colors = [
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // },
    {
      backgroundColor: 'rgba(167,226,222,0.2)',
      borderColor: 'rgba(167,226,222,1)'
    },
    {
      backgroundColor: 'rgba(224,208,157,0.2)',
      borderColor: 'rgba(224,208,157,1);'
    },
  ];


  constructor() {
  }

  ngOnInit() {
  }

}
