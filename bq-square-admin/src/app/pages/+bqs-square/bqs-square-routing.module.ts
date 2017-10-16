import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BqsSquareComponent} from './bqs-square/bqs-square.component';

const routes: Routes = [
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
