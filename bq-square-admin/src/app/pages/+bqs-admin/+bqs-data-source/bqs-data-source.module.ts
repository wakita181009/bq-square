import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {BqsAdminSharedModule} from '../bqs-admin-shared.module';

import {NgRedux} from '@angular-redux/store';
import {IAppState} from 'app/types';

import {createModelReducer} from 'app/store/model/model.reducer';
import {injectAsyncReducer} from 'app/store/root.reducer';

import {BqsDataSourceRoutingModule} from './bqs-data-source-routing.module';
import {BqsDataSourceComponent} from './bqs-data-source.component';
import {BqsDataSourceListComponent} from './bqs-data-source-list/bqs-data-source-list.component';
import {BqsDataSourceEditComponent} from './bqs-data-source-edit/bqs-data-source-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BqsAdminSharedModule,
    BqsDataSourceRoutingModule
  ],
  declarations: [BqsDataSourceComponent, BqsDataSourceListComponent, BqsDataSourceEditComponent]
})
export class BqsDataSourceModule {
  constructor(private store: NgRedux<IAppState>) {
    injectAsyncReducer(this.store, 'data_source', createModelReducer('data_source'));
  }
}
