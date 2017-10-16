import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {SharedModule} from './shared/shared.module';
import {StoreModule} from './store/store.module';
import {AuthModule} from './auth/auth.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BqsSquareSidenavComponent} from './pages/bqs-square-sidenav/bqs-square-sidenav.component';
import {BqsLoginComponent} from './pages/bqs-login/bqs-login.component';


@NgModule({
  declarations: [
    AppComponent,
    BqsSquareSidenavComponent,
    BqsLoginComponent,
    BqsSquareSidenavComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    StoreModule,
    AuthModule
  ],
  providers: [],
  entryComponents: [
    BqsSquareSidenavComponent,
    BqsLoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
