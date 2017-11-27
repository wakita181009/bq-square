import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {clone} from 'ramda';

import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';
import {IModelServiceOptions, IModel, IModelList} from 'app/types';


const VALID_LIST_PARAMS = ['q', 'o', 'limit', 'cursor', 'offset'];

function _genParmas(params: {[key: string]: string|number|boolean}, httpParams = new HttpParams()): HttpParams {
  Object.keys(params)
    .filter(key => VALID_LIST_PARAMS.indexOf(key) !== -1)
    .forEach(key => {
      httpParams = httpParams.set(key, String(params[key]));
    });
  return httpParams
}

function _validateCreateBody(b: IModel): IModel {
  let _b = {};
  Object.keys(b)
    .filter(key => !(typeof(b[key]) === 'string' || Array.isArray(b[key])) || b[key].length >= 0)
    .forEach(key => _b[key] = b[key]);
  return _b
}

function _validateUpdateBody(updatable_properties: string[], b: IModel): IModel {
  let _b = {};
  Object.keys(b)
    .filter(key => updatable_properties.indexOf(key) !== -1)
    .forEach(key => _b[key] = b[key]);
  return _b
}

@Injectable()
export class ModelService extends BaseService {
  constructor(public router: Router,
              public http: HttpClient
  ) {
    super(router, http);
  }

  baseURL: string = `${environment.API_URL}/api/v1/`;

  list(modelServiceOptions: IModelServiceOptions, params: {[key: string]: string|number|boolean}): Observable<IModelList> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `JWT ${localStorage.getItem('bqs_token')}`
    });

    let options = {
      headers: headers,
      params: params && _genParmas(params)
    };
    let url = `${this.baseURL}${modelServiceOptions.name}`;
    return this.http.get(url, options)
      .catch(error => this.handleError(this, error));
  }

  read(modelServiceOptions: IModelServiceOptions, urlsafe): Observable<IModel> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers
    };
    let url = `${this.baseURL}${modelServiceOptions.name}/${urlsafe}`;
    return this.http.get(url, options)
      .catch(error => this.handleError(this, error));
  }

  create(modelServiceOptions: IModelServiceOptions, obj: IModel): Observable<IModel> {
    let body_obj = _validateCreateBody(obj);
    let body = JSON.stringify(body_obj);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers
    };
    let url = `${this.baseURL}${modelServiceOptions.name}/`;

    return this.http.post(url, body, options)
      .catch(error => this.handleError(this, error));
  }

  update(modelServiceOptions: IModelServiceOptions, urlsafe, obj: IModel): Observable<IModel> {
    let body_obj = _validateUpdateBody(modelServiceOptions.updatable_properties, obj);
    let body = JSON.stringify(body_obj);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers
    };
    let url = `${this.baseURL}${modelServiceOptions.name}/${urlsafe}/`;

    return this.http.put(url, body, options)
      .catch(error => this.handleError(this, error));
  }

  del(modelServiceOptions: IModelServiceOptions, urlsafe): Observable<{}> {
    let url = `${this.baseURL}${modelServiceOptions.name}/${urlsafe}/`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let httpParams = new HttpParams().set('permanent', 'true');
    let options = {
      headers: headers,
      params: httpParams
    };
    return this.http.delete(url, options)
      .catch(error => this.handleError(this, error));

  }

}
