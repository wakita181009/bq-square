import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {environment} from '../../environments/environment';

import {Observable} from 'rxjs/Observable';
import {KJUR, b64utoutf8} from 'jsrsasign';

import {NgRedux} from '@angular-redux/store';
import {IAppState} from 'app/types';
import {AuthActions} from 'app/store/auth/auth.actions';

import {_getNavbar, _authenticatePath} from './auth-def';

declare let gapi: any;
declare let window: any;

const PUBLIC_KEY = environment['PUBLIC_KEY'];
const GOOGLE_CLIENT_ID = environment['GOOGLE_CLIENT_ID'];


@Injectable()
export class AuthService {
  constructor(private http: Http,
              private store: NgRedux<IAppState>,
              private authActions: AuthActions) {

    gapi.load('auth2', () => {
      let auth2 = this.auth2 = window.auth2 = gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'profile email'
      });
      auth2.then(() => {
        if (auth2.isSignedIn.get()) {
          let id_token = auth2.currentUser.get().getAuthResponse().id_token;
          console.log("Login with google");
          let loginStream = this.login(id_token).subscribe(
            result => loginStream.unsubscribe(),
            err => this.logout()
          );
        } else {
          this.store.dispatch(this.authActions.authError());
          this.logout()
        }
      });
    });

    // cache
    let token = this._getTokenFromLocalStorage();
    if (token) this.bqs_token = this._getTokenFromLocalStorage();

  }

  // sync token & user object
  public auth2: any;
  private user: any = null;
  private _bqs_token: string = null;

  get bqs_token() {
    return this._bqs_token
  }

  set bqs_token(token) {
    this._bqs_token = token;
    let user = this.user = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[1]));
    this.store.dispatch(this.authActions.authChanged(user));
  }


  private auth_endpoint: string = `${environment.API_URL}/auth`;

  public login(google_token: string): Observable<any> {
    let _body = JSON.stringify({
      google_token: google_token
    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(this.auth_endpoint, _body, options)
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let res = response.json();
        if (res.token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('bqs_token', res.token);
          this.bqs_token = res.token;
        }
        return this.authenticated();
      })
      .catch(error => {
        if (error.status == '403') this.store.dispatch(this.authActions.authError(error._body));
        return Observable.throw(error)
      });
  }

  private _validJwtToken(sJWT): boolean {
    return sJWT ? KJUR.jws.JWS.verify(sJWT, PUBLIC_KEY, {alg: ['RS256']}) : false
  }

  private _getTokenFromLocalStorage() {
    return localStorage.getItem('bqs_token');
  }

  private tokenNotExpired() {
    const token = this._getTokenFromLocalStorage();
    return true
  }

  // Shortcut to get user object
  public authenticated() {
    let token = this.bqs_token;
    if (!token) return;
    if (token && this.bqs_token !== this._getTokenFromLocalStorage()) return;

    let _authenticated = this._validJwtToken(token) && this.tokenNotExpired();
    if (_authenticated) return this.user;
    return
  };

  public logout(): void {
    // clear token remove user from local storage to log user out
    this.auth2.signOut().then(() => {
      localStorage.removeItem('bqs_token');
      if (window.location.pathname !== '/login') {
        console.log("Logout.....redirect to '/login'!");
        window.location.href = '/login';
      }
    });
  }

  public getNavbar(): any {
    let user = this.authenticated();
    return user && user['role'] ? _getNavbar(this.user['role']) : []
  }

  public authenticatePath(user, path): boolean {
    return user && user['role'] ? _authenticatePath(user['role'], path) : false
  }



}
