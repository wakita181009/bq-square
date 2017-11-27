import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BqsDataSourceComponent} from './bqs-data-source.component';
import {BqsDataSourceListComponent} from './bqs-data-source-list/bqs-data-source-list.component';
import {BqsDataSourceEditComponent} from './bqs-data-source-edit/bqs-data-source-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BqsDataSourceComponent,
    children: [
      {
        path: '',
        component: BqsDataSourceListComponent
      },
      {
        path: 'list',
        component: BqsDataSourceListComponent
      },
      {
        path: 'edit',
        component: BqsDataSourceEditComponent
      },
      {
        path: 'edit/:urlsafe',
        component: BqsDataSourceEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsDataSourceRoutingModule {
}
