import {Component, ViewEncapsulation} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';
import {NgRedux} from '@angular-redux/store';

import {AuthService} from './auth/auth.service';
import {IAppState} from 'app/types';
import {AuthActions} from 'app/store/auth/auth.actions';

declare let gapi: any;
declare let window: any;

const PUBLIC_KEY = environment['PUBLIC_KEY'];
const GOOGLE_CLIENT_ID = environment['GOOGLE_CLIENT_ID'];


@Component({
  selector: 'bqs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[class.docs-dark-theme]': 'isDarkTheme',
  },
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  isDarkTheme = false;
  menu = [];

  @select(['auth']) auth$: Observable<any>;

  constructor(private authService: AuthService,
              private store: NgRedux<IAppState>,
              private authActions: AuthActions) {
    this.store.dispatch(this.authActions.authChanged(this.authService.authenticated()));
  }

  ngOnInit() {
    this.auth$.subscribe(auth => {
      this.menu = this.authService.getNavbar();
    });
  }

  logout() {
    this.authService.logout()
  }
}
