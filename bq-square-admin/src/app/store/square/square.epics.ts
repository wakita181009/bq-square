import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {combineEpics} from 'redux-observable';
import {NgRedux} from '@angular-redux/store';

import {SquareService} from 'app/shared/services/square.service';
import {SquareActions} from './square.actions';
import {IAppState, TPayloadAction, FSA, ISquare, IGlobal} from 'app/types';



@Injectable()
export class SquareEpics {
  constructor(private squareService: SquareService,
              private squareActions: SquareActions) {
  }

  createEpics() {
    return combineEpics(
      this.createRunQueryEpics(),
      this.createReadSquareEpics(),
      this.createListSquareEpics(),
      this.createGetGlobalKeyValueEpics()
    )
  }

  createRunQueryEpics() {
    return (action$: Observable<TPayloadAction>, store: NgRedux<IAppState>): Observable<FSA<any, void>> =>
      action$
        .filter(
          ({type}) => type === SquareActions.RUN_ALL_QUERY
        ).switchMap((action) =>
        Observable.from(store.getState().square.active.items)
          .map((item, index) => {
            return {item: item, index: index}
          })
          .filter(({item}) => item.type.indexOf('input_') !== 0)
          .mergeMap(obj =>
            this.squareService.runQuery(obj.item.query_url, obj.item.type, obj.item.format, store.getState().square.global)
              .map(data => this.squareActions.runQueryCompleted({
                result: data.result,
                index: obj.index
              }))
              .catch(error => Observable.of(
                this.squareActions.runQueryError({
                  index: obj.index,
                  error_msg: error
                })
              ))
              .takeUntil(action$.filter(({type}) => type === SquareActions.SQUARE_CHANGED))
          )
      )
  }

  createReadSquareEpics() {
    return (action$: Observable<TPayloadAction>): Observable<FSA<ISquare, void>> =>
      action$
        .filter(
          ({type}) => type == SquareActions.READ_SQUARE
        ).switchMap((action) =>
        this.squareService.getReport(action['payload'])
          .map(data => this.squareActions.readSquareCompleted(data))
          .catch(error => Observable.of(this.squareActions.squareError(error)))
          .takeUntil(action$.filter(({type}) => type === SquareActions.SQUARE_CHANGED))
      )
  }

  createListSquareEpics() {
    return (action$: Observable<TPayloadAction>): Observable<FSA<ISquare, void>> =>
      action$
        .filter(
          ({type}) => type == SquareActions.LIST_SQUARE
        ).switchMap((action) =>
        this.squareService.getReportList()
          .map(data => this.squareActions.listSquareCompleted(data))
          .catch(error => Observable.of(this.squareActions.squareError(error)))
          .takeUntil(action$.filter(({type}) => type === SquareActions.SQUARE_CHANGED))
      )
  }

  createGetGlobalKeyValueEpics() {
    return (action$: Observable<TPayloadAction>, store: NgRedux<IAppState>): Observable<FSA<IGlobal, void>> =>
      action$
        .filter(
          ({type}) => type == SquareActions.GET_GLOBAL_KEY_VALUE
        )
        .mergeMap(({payload}) => this.squareService.getGlobalKeyValue(payload)
          .map(data => this.squareActions.getGlobalKeyValueCompleted(data))
          .catch(error => Observable.of(this.squareActions.squareError(error)))
        )
  }

}
