import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Http, RequestOptions} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {MatButtonModule, MatIconModule} from '@angular/material';

import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';

import {GoogleLoginButtonComponent} from './google-login-button/google-login-button.component';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'bqs_token',
    globalHeaders: [{'Content-Type': 'application/json'}],
    headerPrefix: 'JWT '
  }), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthService,
    AuthGuard
  ],
  declarations: [GoogleLoginButtonComponent],
  exports: [GoogleLoginButtonComponent]
})
export class AuthModule {
}
