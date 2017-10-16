import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {combineEpics} from 'redux-observable';

import {AuthService} from 'app/auth/auth.service';
import {AuthActions} from './auth.actions';
import {TPayloadAction, FSA} from 'app/types';


@Injectable()
export class AuthEpics {
    constructor(private authService: AuthService,
                private authActions: AuthActions) {
    }

    createEpics() {
        return combineEpics(
        )
    }

}
