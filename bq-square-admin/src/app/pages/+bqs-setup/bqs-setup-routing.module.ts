import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BqsSetupComponent} from './bqs-setup/bqs-setup.component';

const routes: Routes = [
  {
    'path': '',
    'component': BqsSetupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsSetupRoutingModule {
}
