import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';

import {NgRedux} from '@angular-redux/store';
import {IAppState} from 'app/types';

import {createModelReducer} from 'app/store/model/model.reducer';
import {injectAsyncReducer} from 'app/store/root.reducer';

import {BqsGlobalKeyValueRoutingModule} from './bqs-global-key-value-routing.module';
import {BqsGlobalKeyValueComponent} from './bqs-global-key-value.component';
import {BqsGlobalKeyListComponent} from './bqs-global-key-list/bqs-global-key-list.component';
import {BqsGlobalKeyEditComponent} from './bqs-global-key-edit/bqs-global-key-edit.component';
import {BqsGlobalKeyViewComponent} from './bqs-global-key-view/bqs-global-key-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BqsGlobalKeyValueRoutingModule
  ],
  declarations: [BqsGlobalKeyValueComponent, BqsGlobalKeyListComponent, BqsGlobalKeyEditComponent, BqsGlobalKeyViewComponent]
})
export class BqsGlobalKeyValueModule {
  constructor(private store: NgRedux<IAppState>) {
    injectAsyncReducer(this.store, 'user', createModelReducer('user'));
    injectAsyncReducer(this.store, 'global_key', createModelReducer('global_key'));
    injectAsyncReducer(this.store, 'global_value', createModelReducer('global_value'));
  }
}
