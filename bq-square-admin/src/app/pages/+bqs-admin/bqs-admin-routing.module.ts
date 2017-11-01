import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'data_source',
    loadChildren: 'app/pages/+bqs-admin/+bqs-data-source/bqs-data-source.module#BqsDataSourceModule'
  },
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
    path: 'global_key_value',
    loadChildren: 'app/pages/+bqs-admin/+bqs-global-key-value/bqs-global-key-value.module#BqsGlobalKeyValueModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsAdminRoutingModule { }
