import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {AuthModule} from 'app/auth/auth.module';

import {BqsSetupRoutingModule} from './bqs-setup-routing.module';
import {BqsSetupComponent} from './bqs-setup/bqs-setup.component';
import {SetupService} from './setup.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthModule,
    BqsSetupRoutingModule
  ],
  declarations: [BqsSetupComponent],
  providers: [SetupService]
})
export class BqsSetupModule {
}
