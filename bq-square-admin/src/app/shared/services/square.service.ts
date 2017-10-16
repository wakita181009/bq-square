import {Injectable}     from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {clone} from 'ramda';

import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';
import {ISquareItem} from 'app/types';
import {format_date} from 'app/utils/date';


@Injectable()
export class SquareService extends BaseService {
  constructor(public router: Router,
              public http: AuthHttp) {
    super(router, http);
  }

  baseURL: string = `${environment.API_URL}`;

  runQuery(query_url, type = null, format = null, params: any = {}): Observable<ISquareItem> {
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    let options = new RequestOptions({
      headers: headers,
      params: this.validateParams(params)
    });
    let body;
    if (format) body = JSON.stringify({format: format});
    let url = `${query_url}/${type || ''}`;
    return this.http.post(url, body, options)
      .map(this.extractData)
      .catch(error => this.handleError(this, error));
  }

  getReport(urlsafe = '') {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = `${this.baseURL}/getReport/${urlsafe}`;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(error => this.handleError(this, error));
  }

  getReportList() {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = `${this.baseURL}/getReportList`;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(error => this.handleError(this, error));
  }

  getGlobalKeyValue(key_name: string) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let url = `${this.baseURL}/getGlobalKeyValue/${key_name}`;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(error => this.handleError(this, error));
  }

  private validateParams(o) {
    let obj = clone(o);
    let result = {};
    for (let _key in obj) {
      if (obj.hasOwnProperty(_key)&&obj[_key]['value']) {
        let value = obj[_key]['value'];
        if (
          !(((typeof(value) == 'string')
          && value.length < 1) ||
          (Array.isArray(obj[_key])
          && value.length < 1))
        ) {
          if (value instanceof Date) value = format_date(value);
          result[_key] = value
        }
      }
    }
    return result
  }


}
