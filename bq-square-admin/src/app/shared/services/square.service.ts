import {Injectable}     from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {clone} from 'ramda';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';
import {ISquareItem} from 'app/types';
import {format_date} from 'app/utils/date';

const VALID_LIST_PARAMS = ['q', 'o', 'limit', 'cursor', 'offset'];

function _genParmas(params: {[key: string]: string|number|boolean}, httpParams = new HttpParams()): HttpParams {
  Object.keys(params)
    .filter(key => VALID_LIST_PARAMS.indexOf(key) !== -1)
    .forEach(key => {
      httpParams = httpParams.set(key, String(params[key]));
    });
  return httpParams
}

@Injectable()
export class SquareService extends BaseService {
  constructor(public router: Router,
              public http: HttpClient) {
    super(router, http);
  }

  baseURL: string = `${environment.API_URL}`;

  runQuery(query_url, type = null, format = null, params: any = {}): Observable<ISquareItem> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let _params = this.validateParams(params);
    let httpParams = new HttpParams();
    if (_params) Object.keys(_params).forEach((key) => {
      httpParams = httpParams.append(key, _params[key]);
    });

    let options = ({
      headers: headers,
      params: httpParams
    });
    let body;
    if (format) body = JSON.stringify({format: format});
    let url = `${query_url}/${type || ''}`;
    return this.http.post(url, body, options)
      .catch(error => this.handleError(this, error));
  }

  getReport(urlsafe = '') {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers
    };
    let url = `${this.baseURL}/getReport/${urlsafe}`;
    return this.http.get(url, options)
      .catch(error => this.handleError(this, error));
  }

  getReportList(params: {[key: string]: string|number|boolean}) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers,
      params: params && _genParmas(params)
    };
    let url = `${this.baseURL}/getReportList`;
    return this.http.get(url, options)
      .catch(error => this.handleError(this, error));
  }

  getGlobalKeyValue(key_name: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers
    };
    let url = `${this.baseURL}/getGlobalKeyValue/${key_name}`;
    return this.http.get(url, options)
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
