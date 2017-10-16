import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentFactoryResolver,
} from '@angular/core';

import {BqsSquareItemHostDirective} from './bqs-square-item.directive';

import {ISquareItem} from 'app/types/square';
// import {PlotlyJsComponent} from '../plotly-js/plotly-js.component';
import {ChartJsComponent} from '../chart-js/chart-js.component';
import {DataTableComponent} from '../data-table/data-table.component';
import {InputDateComponent} from '../input-date/input-date.component';
import {InputSelectComponent} from '../input-select/input-select.component';
import {InputValueComponent} from '../input-value/input-value.component';


export interface IBqsSquareItem {
  data: any;
}

export const bqsSquareItemMap = {
  chart: ChartJsComponent,
  // plot: PlotlyJsComponent,
  table: DataTableComponent,
  input_date: InputDateComponent,
  input_select: InputSelectComponent,
  input_value: InputValueComponent
};

@Component({
  selector: 'bqs-square-item',
  templateUrl: './bqs-square-item.component.html',
  styleUrls: ['./bqs-square-item.component.scss'],
})
export class BqsSquareItemComponent implements OnInit {
  @Input() squareItem: ISquareItem;
  @ViewChild(BqsSquareItemHostDirective) squareItemHost: BqsSquareItemHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    let component = bqsSquareItemMap[this.squareItem.type];
    if (component) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      let viewContainerRef = this.squareItemHost.viewContainerRef;
      viewContainerRef.clear();
      let componentRef = viewContainerRef.createComponent(componentFactory);
      (<IBqsSquareItem>componentRef.instance).data = this.squareItem;
    }
  }



}
