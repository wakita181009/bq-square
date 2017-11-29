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
      this.createLoginEpics(),
    )
  }

  createLoginEpics() {
    return (action$: Observable<TPayloadAction>): Observable<FSA<any, void>> =>
      action$
        .filter(
          ({type}) => type === AuthActions.LOGIN
        ).switchMap((action) =>
        this.authService.login(action['payload'])
          .map(user => this.authActions.authChanged(user))
      ).catch(error => Observable.of(this.authActions.authError(error)))
  }



}
