import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BqsQueryComponent} from './bqs-query.component';
import {BqsQueryListComponent} from './bqs-query-list/bqs-query-list.component';
import {BqsQueryEditComponent} from './bqs-query-edit/bqs-query-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BqsQueryComponent,
    children: [
      {
        path: '',
        component: BqsQueryListComponent
      },
      {
        path: 'list',
        component: BqsQueryListComponent
      },
      {
        path: 'edit',
        component: BqsQueryEditComponent
      },
      {
        path: 'edit/:urlsafe',
        component: BqsQueryEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsQueryRoutingModule {
}
