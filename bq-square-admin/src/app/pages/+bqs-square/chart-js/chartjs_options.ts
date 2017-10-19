function thousandsSeparator(value, index, values) {
  value = value.toString().split(/(?=(?:...)*$)/).join(',');
  return value;
}

const OPTIONS_LINE = {
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

const OPTIONS_LINE_MULTI_AXIS = {
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

const OPTIONS_PIE = {
  responsive: true,
  legend: {
    position: 'right',
  },
};


export const CHARTJS_OPTIONS = {
  line: OPTIONS_LINE,
  line_multi_axis: OPTIONS_LINE_MULTI_AXIS,
  pie: OPTIONS_PIE
};
