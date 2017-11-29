import {NgModule} from '@angular/core';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import {NgReduxModule, NgRedux, DevToolsExtension} from '@angular-redux/store';
import {provideReduxForms} from '@angular-redux/form';

// Redux ecosystem stuff.
import {createEpicMiddleware} from 'redux-observable';

import {IAppState} from '../types';
import {createReducer} from './root.reducer';
import {RootEpics} from './root.epics';

import {SquareEpics} from './square/square.epics';
import {SquareActions} from './square/square.actions';

import {AuthEpics} from './auth/auth.epics';
import {AuthActions} from './auth/auth.actions';

import {ModelActions} from './model/model.actions';
import {ModelEpics} from './model/model.epics';

import {environment} from '../../environments/environment';


@NgModule({
  imports: [NgReduxModule],
  providers: [
    RootEpics,
    SquareActions,
    SquareEpics,
    ModelActions,
    ModelEpics,
    AuthActions,
    AuthEpics
  ]
})
export class StoreModule {
  constructor(public store: NgRedux<IAppState>,
              devTools: DevToolsExtension,
              rootEpics: RootEpics) {
    store.configureStore(
      createReducer(),
      undefined,
      [createEpicMiddleware(rootEpics.createEpics())],
      (!environment.production && devTools.isEnabled()) ? [devTools.enhancer()] : []);

    // Enable syncing of Angular form state with our Redux store.
    provideReduxForms(store);
  }
}
