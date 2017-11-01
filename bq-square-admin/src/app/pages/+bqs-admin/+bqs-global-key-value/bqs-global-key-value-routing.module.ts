import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BqsGlobalKeyListComponent} from './bqs-global-key-list/bqs-global-key-list.component';
import {BqsGlobalKeyEditComponent} from './bqs-global-key-edit/bqs-global-key-edit.component';
import {BqsGlobalKeyViewComponent} from './bqs-global-key-view/bqs-global-key-view.component';

const routes: Routes = [
  {
    path: '',
    component: BqsGlobalKeyListComponent
  },
  {
    path: 'list',
    component: BqsGlobalKeyListComponent
  },
  {
    path: 'edit',
    component: BqsGlobalKeyEditComponent
  },
  {
    path: 'edit/:urlsafe',
    component: BqsGlobalKeyEditComponent
  },
  {
    path: ':urlsafe',
    component: BqsGlobalKeyViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BqsGlobalKeyValueRoutingModule {
}
