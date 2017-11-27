import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BqsSquareComponent} from './bqs-square/bqs-square.component';
import {BqsSquareListComponent} from './bqs-square-list/bqs-square-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: BqsSquareListComponent
  },
  {
    path: '',
    component: BqsSquareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsSquareRoutingModule {
}
