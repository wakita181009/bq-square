import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule} from '@angular/material';

import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';

import {GoogleLoginButtonComponent} from './google-login-button/google-login-button.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  declarations: [GoogleLoginButtonComponent],
  exports: [GoogleLoginButtonComponent]
})
export class AuthModule {
}
