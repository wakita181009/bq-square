import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {BqsReportComponent} from './bqs-report.component';
import {BqsReportListComponent} from './bqs-report-list/bqs-report-list.component';
import {BqsReportEditComponent} from './bqs-report-edit/bqs-report-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BqsReportComponent,
    children: [
      {
        path: '',
        component: BqsReportListComponent
      },
      {
        path: 'list',
        component: BqsReportListComponent
      },
      {
        path: 'edit',
        component: BqsReportEditComponent
      },
      {
        path: 'edit/:urlsafe',
        component: BqsReportEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsReportRoutingModule { }
