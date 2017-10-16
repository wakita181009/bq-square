import {Injectable} from '@angular/core';
import {FSA} from 'app/types/flux-standard';

declare let window: any;

@Injectable()
export class AuthActions {
  constructor() {
  }

  static readonly AUTH_CHANGED = "AUTH_CHANGED";
  static readonly LOGOUT = "LOGOUT";
  static readonly AUTH_ERROR = "AUTH_ERROR";

  authChanged(payload: any): FSA<any, void> {
    return {
      type: AuthActions.AUTH_CHANGED,
      payload
    }
  }

  authError(payload=null): FSA<any, void> {
    return {
      type: AuthActions.AUTH_ERROR,
      payload
    }
  }

}
