import {Component, ViewEncapsulation} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';

import {AuthService} from './auth/auth.service';


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

  constructor(private authService: AuthService) {
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
