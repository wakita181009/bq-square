import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

import {Observable} from 'rxjs/Observable';
import {KJUR, b64utoutf8} from 'jsrsasign';

import {_getNavbar, _authenticatePath} from './auth-def';

declare let gapi: any;
declare let window: any;

const PUBLIC_KEY = environment['PUBLIC_KEY'];
const GOOGLE_CLIENT_ID = environment['GOOGLE_CLIENT_ID'];


@Injectable()
export class AuthService {

  constructor(private http: Http,
              private router: Router) {
    gapi.load('auth2', () => {
      let auth2 = window.auth2 = gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'profile email'
      });
    });

    let token = this._getTokenFromLocalStorage();
    if (token) this.bqs_token = token;
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
        if (error.status == '403' && error._body.indexOf("NeedSetupError") !== -1) {
          console.log("NeedSetupError.....redirect to '/setup'!");
          this.router.navigate(['/setup']);
        } else {
          this.logout();
        }
        return Observable.throw(error)
      });
  }

  // sync token & user object
  private user: any = null;
  private _bqs_token: string = null;

  get bqs_token() {
    return this._bqs_token
  }

  set bqs_token(token) {
    this._bqs_token = token;
    this.user = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[1]));
  }

  private _getTokenFromLocalStorage() {
    return localStorage.getItem('bqs_token');
  }

  private _validJwtToken(sJWT): boolean {
    return sJWT ? KJUR.jws.JWS.verifyJWT(sJWT, PUBLIC_KEY, {
      alg: ['RS256'],
      iss: [window.location.origin]
    }) : false
  }

  // Shortcut to get user object
  public authenticated() {
    let token = this.bqs_token;
    if (!token) return;
    if (token && this.bqs_token !== this._getTokenFromLocalStorage()) return;

    if (this._validJwtToken(token)) {
      return this.user
    } else {
      return this.logout()
    }
  };

  public logout(): void {
    // clear token remove user from local storage to log user out
    window.auth2.signOut().then(() => {
      localStorage.removeItem('bqs_token');
      console.log("Logout.....redirect to '/login'!");
      window.location.href = '/login';
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
