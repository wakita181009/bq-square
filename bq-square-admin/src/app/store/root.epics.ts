import {Injectable} from '@angular/core';
import {combineEpics} from 'redux-observable';

import {ModelEpics} from './model/model.epics';
import {SquareEpics} from './square/square.epics';


@Injectable()
export class RootEpics {
  constructor(private modelEpics: ModelEpics,
              private squareEpics: SquareEpics) {
  }

  createEpics() {
    return combineEpics(
      this.modelEpics.createEpics('data_source'),
      this.modelEpics.createEpics('query'),
      this.modelEpics.createEpics('report'),
      this.modelEpics.createEpics('user'),
      this.modelEpics.createEpics('global_key'),
      this.modelEpics.createEpics('global_value'),
      this.squareEpics.createEpics()
    )
  }
}
