import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {BqsAdminSharedModule} from '../bqs-admin-shared.module';

import {NgRedux} from '@angular-redux/store';
import {IAppState} from 'app/types';

import {createModelReducer} from 'app/store/model/model.reducer';
import {injectAsyncReducer} from 'app/store/root.reducer';

import {BqsReportRoutingModule} from './bqs-report-routing.module';
import {BqsReportListComponent} from './bqs-report-list/bqs-report-list.component';
import {BqsReportEditComponent} from './bqs-report-edit/bqs-report-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BqsAdminSharedModule,
    BqsReportRoutingModule
  ],
  declarations: [BqsReportListComponent, BqsReportEditComponent]
})
export class BqsReportModule {
  constructor(private store: NgRedux<IAppState>) {
    injectAsyncReducer(this.store, 'report', createModelReducer('report'));
  }
}
