import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {environment} from '../../../environments/environment';

import {Observable} from 'rxjs/Observable';


@Injectable()
export class SetupService {
  constructor(private http: Http) {
  }

  baseURL: string = `${environment.API_URL}`;

  setupAuthorization(google_token) {
    let _url = `${this.baseURL}/setup_authorization`;

    let _body = JSON.stringify({
      google_token: google_token
    });
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(_url, _body, options)
      .map(this.extractData)
      .catch(error => this.handleError(error));
  }

  setup(data) {
    let _url = `${this.baseURL}/setup`;

    let _body = JSON.stringify(data);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post(_url, _body, options)
      .map(this.extractData)
      .catch(error => this.handleError(error));
  }

  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    let errMsg;
    if (error.message) {
      errMsg = error.message;
    } else if (error.status) {
      errMsg = `${error.status} - ${error._body || error.statusText}`;
      if (error.status == '403') window.location.href = '/login';
    } else {
      errMsg = error
    }

    return Observable.throw(errMsg);
  }


}
