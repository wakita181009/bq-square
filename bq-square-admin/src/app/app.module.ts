import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';

import {SharedModule} from './shared/shared.module';
import {StoreModule} from './store/store.module';
import {AuthModule} from './auth/auth.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BqsLoginComponent} from './pages/bqs-login/bqs-login.component';

import {environment} from '../environments/environment';


export function getJwtToken(): string {
    return localStorage.getItem('bqs_token');
}

@NgModule({
  declarations: [
    AppComponent,
    BqsLoginComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    StoreModule,
    AuthModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getJwtToken,
        authScheme: 'JWT ',
        skipWhenExpired: true,
        whitelistedDomains: environment.production ? [] : ['localhost:8080']
      }
    }),
    SharedModule.forRoot(),
  ],
  providers: [],
  entryComponents: [
    BqsLoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
