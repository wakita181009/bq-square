import {combineReducers} from 'redux';
import {composeReducers, defaultFormReducer} from '@angular-redux/form';

import {IAppState} from '../types';
import {squareReducer} from './square/square.reducer';
import {authReducer} from './auth/auth.reducer';



export function createReducer(asyncAdminReducers = null) {
  return composeReducers(
    defaultFormReducer(),
    combineReducers<IAppState>({
      square: squareReducer,
      auth: authReducer,
      admin: asyncAdminReducers?combineReducers({
        ...asyncAdminReducers
      }) : null
    })
  );
}

export function injectAsyncReducer(store, name, asyncReducer) {
  store.asyncReducers  = store.asyncReducers || {};
  if(!store.asyncReducers[name]) {
    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  }
}
