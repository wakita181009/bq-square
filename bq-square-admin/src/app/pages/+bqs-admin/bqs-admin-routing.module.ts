import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'query',
    loadChildren: 'app/pages/+bqs-admin/+bqs-query/bqs-query.module#BqsQueryModule'
  },
  {
    path: 'report',
    loadChildren: 'app/pages/+bqs-admin/+bqs-report/bqs-report.module#BqsReportModule'
  },
  {
    path: 'user',
    loadChildren: 'app/pages/+bqs-admin/+bqs-user/bqs-user.module#BqsUserModule'
  },
  {
    path: 'key_value',
    loadChildren: 'app/pages/+bqs-admin/+bqs-key-value/bqs-key-value.module#BqsKeyValueModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsAdminRoutingModule { }