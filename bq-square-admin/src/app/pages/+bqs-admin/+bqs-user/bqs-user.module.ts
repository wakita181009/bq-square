import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';

import {NgRedux} from '@angular-redux/store';
import {IAppState} from 'app/types';

import {createModelReducer} from 'app/store/model/model.reducer';
import {injectAsyncReducer} from 'app/store/root.reducer';

import {BqsUserRoutingModule} from './bqs-user-routing.module';
import {BqsUserComponent} from './bqs-user.component';
import {BqsUserListComponent} from './bqs-user-list/bqs-user-list.component';
import {BqsUserEditComponent} from './bqs-user-edit/bqs-user-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BqsUserRoutingModule
  ],
  declarations: [BqsUserComponent, BqsUserListComponent, BqsUserEditComponent]
})
export class BqsUserModule {
  constructor(private store: NgRedux<IAppState>) {
    injectAsyncReducer(this.store, 'user', createModelReducer('user'));
  }
}
