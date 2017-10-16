import {Component, OnInit, ChangeDetectionStrategy, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'app/auth/auth.service';

declare let auth2: any;
declare let window: any;

@Component({
  selector: 'google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleLoginButtonComponent implements OnInit {

  constructor(private router: Router,
              private zone: NgZone,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  onSignIn = (googleUser) => {
    let id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);

    this.authService.login(id_token)
      .subscribe(
        result => {
          if (result) {
            let redirectUrl = localStorage.getItem('redirect_url');
            if (redirectUrl) {
              localStorage.removeItem('redirect_url');
              this.zone.run(() => this.router.navigate([redirectUrl]));
            } else {
              this.zone.run(() => this.router.navigate(['/']));
            }
          }
        },
        error => {
          if (error.status == '403' && error._body.indexOf("NeedSetupError") !== -1) {
            console.log("NeedSetupError.....redirect to '/setup'!");
            this.zone.run(() => this.router.navigate(['/setup']));
          }
        })
  };

  googleLogin() {
    auth2.then(() => {
      auth2.signIn().then(this.onSignIn);
    });
  }


}
