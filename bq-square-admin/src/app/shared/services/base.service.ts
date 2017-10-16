import {Injectable}     from '@angular/core';
import {Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class BaseService {
    constructor(public router: Router,
                public http: AuthHttp) {
    }

    baseURL: string;

    extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    handleError(self: any, error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // let errMsg = (error.message) ? error.message :
        //   error.status ? `${error.status} - ${error._body || error.statusText}` : error;
        // console.error(errMsg); // log to console instead

        let errMsg;
        if (error.message) {
            errMsg = error.message;
        } else if (error.status) {
            errMsg = `${error.status} - ${error._body || error.statusText}`;
            // if (error.status == '403') self.authService.logout();
        } else {
            errMsg = error
        }

        return Observable.throw(errMsg);
    }

}
