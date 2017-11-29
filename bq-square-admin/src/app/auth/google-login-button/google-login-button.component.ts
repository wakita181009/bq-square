import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';

import {IAppState} from 'app/types';
import {AuthActions} from 'app/store/auth/auth.actions';

declare let auth2: any;

@Component({
  selector: 'google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleLoginButtonComponent implements OnInit {

  @select(['auth', 'user']) user$: Observable<any>;

  constructor(private router: Router,
              private store: NgRedux<IAppState>,
              private authActions: AuthActions) {
  }

  ngOnInit() {
  }

  googleLogin() {
    let user_stream = this.user$
      .filter(user => !!user)
      .take(1)
      .subscribe(user => {
        if (!!user) {
          let redirectUrl = localStorage.getItem('redirect_url');
          if (!!redirectUrl) {
            localStorage.removeItem('redirect_url');
            this.router.navigate(['/admin/query'])
          } else {
            this.router.navigate(['/'])
          }
        }
        user_stream.unsubscribe()
      });

    auth2.then(() => {
      auth2.signIn().then(googleUser => {
        let id_token = googleUser.getAuthResponse().id_token;
        this.store.dispatch(this.authActions.login(id_token))
      });
    });
  }


}
