import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';

import 'chart.js';
import {ChartsModule} from 'ng2-charts';

import {BqsSquareRoutingModule} from './bqs-square-routing.module';
import {BqsSquareComponent} from './bqs-square/bqs-square.component';
import {BqsSquareItemComponent} from './bqs-square-item/bqs-square-item.component';
import {BqsSquareItemHostDirective} from './bqs-square-item/bqs-square-item.directive';
import {PlotlyJsComponent} from './plotly-js/plotly-js.component';
import {DataTableComponent} from './data-table/data-table.component';
import {ChartJsComponent} from './chart-js/chart-js.component';
import {InputDateComponent} from './input-date/input-date.component';
import {InputValueComponent} from './input-value/input-value.component';
import {InputSelectComponent} from './input-select/input-select.component';
import {BqsSquareListComponent} from './bqs-square-list/bqs-square-list.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChartsModule,
    BqsSquareRoutingModule
  ],
  declarations: [
    BqsSquareComponent,
    BqsSquareItemComponent,
    BqsSquareItemHostDirective,
    PlotlyJsComponent,
    DataTableComponent,
    ChartJsComponent,
    InputDateComponent,
    InputValueComponent,
    InputSelectComponent,
    BqsSquareListComponent
  ],
  entryComponents: [
    PlotlyJsComponent,
    DataTableComponent,
    ChartJsComponent,
    InputDateComponent,
    InputValueComponent,
    InputSelectComponent
  ]
})
export class BqsSquareModule {
}
