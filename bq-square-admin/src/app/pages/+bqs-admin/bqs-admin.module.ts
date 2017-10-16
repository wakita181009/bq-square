import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {BqsAdminSharedModule} from './bqs-admin-shared.module';

import {BqsAdminRoutingModule} from './bqs-admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BqsAdminSharedModule,
    BqsAdminRoutingModule
  ],
  declarations: []
})
export class BqsAdminModule {
}
