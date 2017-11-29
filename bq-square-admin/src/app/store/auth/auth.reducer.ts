import {TPayloadAction} from '../../types';
import {Reducer} from 'redux';

import {tassign} from 'tassign';
import {assocPath, merge} from 'ramda';

import {AuthActions} from './auth.actions';


export const authInitialState = {
  user: null,
  error: null,
  loading: true
};

export const authReducer: Reducer<any> =
  (state = authInitialState, action: TPayloadAction) => {
    switch (action.type) {
      case AuthActions.LOGIN:
        return tassign(
          state,
          {
            loading: true
          }
        );
      case AuthActions.AUTH_CHANGED:
        return tassign(
          state,
          {
            user: action.payload,
            loading: false
          }
        );
      case AuthActions.AUTH_ERROR:
        return tassign(
          authInitialState,
          {
            error: action.payload,
            loading: false
          }
        );
      default:
        return state
    }
  };
