import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {BqsUserComponent} from './bqs-user.component';
import {BqsUserListComponent} from './bqs-user-list/bqs-user-list.component';
import {BqsUserEditComponent} from './bqs-user-edit/bqs-user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: BqsUserComponent,
    children: [
      {
        path: '',
        component: BqsUserListComponent
      },
      {
        path: 'list',
        component: BqsUserListComponent
      },
      {
        path: 'edit',
        component: BqsUserEditComponent
      },
      {
        path: 'edit/:urlsafe',
        component: BqsUserEditComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsUserRoutingModule { }
