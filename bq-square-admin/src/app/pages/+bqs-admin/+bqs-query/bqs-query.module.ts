import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {BqsAdminSharedModule} from '../bqs-admin-shared.module';

import {NgRedux} from '@angular-redux/store';
import {IAppState} from 'app/types';

import {createModelReducer} from 'app/store/model/model.reducer';
import {injectAsyncReducer} from 'app/store/root.reducer';

import {BqsQueryRoutingModule} from './bqs-query-routing.module';
import {BqsQueryComponent} from './bqs-query.component';
import {BqsQueryListComponent} from './bqs-query-list/bqs-query-list.component';
import {BqsQueryEditComponent} from './bqs-query-edit/bqs-query-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BqsAdminSharedModule,
    BqsQueryRoutingModule
  ],
  declarations: [BqsQueryComponent, BqsQueryListComponent, BqsQueryEditComponent]
})
export class BqsQueryModule {
  constructor(private store: NgRedux<IAppState>) {
    injectAsyncReducer(this.store, 'data_source', createModelReducer('data_source'));
    injectAsyncReducer(this.store, 'query', createModelReducer('query'));
  }
}
