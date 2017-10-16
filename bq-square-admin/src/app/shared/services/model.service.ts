import {Injectable}     from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {clone} from 'ramda';

import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';
import {IModelServiceOptions, IModel, IModelList} from 'app/types';


@Injectable()
export class ModelService extends BaseService {
    constructor(public router: Router,
                public http: AuthHttp) {
        super(router, http);
    }

    baseURL: string = `${environment.API_URL}/api/v1/`;

    list(modelServiceOptions: IModelServiceOptions, query?: any): Observable<IModelList> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let url = `${this.baseURL}${modelServiceOptions.name}`;
        if (query) url = `${url}?q=${query}`;
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(error => this.handleError(this, error));
    }

    read(modelServiceOptions: IModelServiceOptions, urlsafe): Observable<IModel> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let url = `${this.baseURL}${modelServiceOptions.name}/${urlsafe}`;
        return this.http.get(url, options)
            .map(this.extractData)
            .catch(error => this.handleError(this, error));
    }

    create(modelServiceOptions: IModelServiceOptions, obj: IModel): Observable<IModel> {
        let body_obj = this.validateCreateObj(obj);
        let body = JSON.stringify(body_obj);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let url = `${this.baseURL}${modelServiceOptions.name}/`;

        return this.http.post(url, body, options)
            .map(this.extractData)
            .catch(error => this.handleError(this, error));
    }

    update(modelServiceOptions: IModelServiceOptions, urlsafe, obj: IModel): Observable<IModel> {
        let body_obj = this.validateUpdateObj(modelServiceOptions.updatable_properties, obj);
        let body = JSON.stringify(body_obj);
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let url = `${this.baseURL}${modelServiceOptions.name}/${urlsafe}/`;

        return this.http.put(url, body, options)
            .map(this.extractData)
            .catch(error => this.handleError(this, error));
    }

    del(modelServiceOptions: IModelServiceOptions, urlsafe): Observable<{}> {
        let url = `${this.baseURL}${modelServiceOptions.name}/${urlsafe}/`;
        let headers = new Headers({'Content-Type': 'application/json'});
        let params = {permanent: 'true'};
        let options = new RequestOptions({headers: headers, params: params});

        return this.http.delete(url, options)
            .map(this.extractData)
            .catch(error => this.handleError(this, error));

    }

    private validateCreateObj(o: IModel) {
        let obj = clone(o);
        for (let _key in obj) {
            if (obj.hasOwnProperty(_key)) {
                if (
                    ((typeof(obj[_key]) == 'string')
                    && obj[_key].length < 1) ||
                    (Array.isArray(obj[_key])
                    && obj[_key].length < 1)
                ) delete obj[_key];
            }
        }
        return obj
    }

    private validateUpdateObj(updatable_properties: string[], o: IModel) {
        let obj = clone(o);
        for (let _key in obj) {
            if (obj.hasOwnProperty(_key)) {
                if (updatable_properties.indexOf(_key) == -1) delete obj[_key];
            }
        }
        return obj
    }


}
