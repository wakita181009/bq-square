import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {combineEpics} from 'redux-observable';
import {NgRedux} from '@angular-redux/store';

import {ModelService} from 'app/shared/services/model.service';

import {ModelActions} from './model.actions';
import {IAppState, TPayloadAction, FSA, IModel, IModelMeta, modelServiceOptions} from 'app/types';


@Injectable()
export class ModelEpics {
  constructor(public modelService: ModelService,
              public modelActions: ModelActions) {
  }

  createEpics(modelName: string) {
    return combineEpics(
      this.createListModelEpic(modelName),
      this.createReloadModelEpic(modelName),
      this.createReadModelEpic(modelName),
      this.createCreateModelEpic(modelName),
      this.createUpdateModelEpic(modelName),
      this.createDeleteModelEpic(modelName)
    )

  }

  createListModelEpic(modelName: string) {
    return (action$: Observable<TPayloadAction>, store: NgRedux<IAppState>): Observable<FSA<IModel[], IModelMeta>> =>
      action$
        .filter(
          ({type}) => type == ModelActions.LIST_MODEL
        )
        .filter(({meta}) => meta['modelName'] === modelName)
        .switchMap(({payload}) => this.modelService.list(modelServiceOptions[modelName], payload&&payload['q'])
          .map(data => this.modelActions.listModelCompleted(modelName, data.list))
          .catch(error => Observable.of(this.modelActions.modelError(modelName, error)))
        )
  }

  createReloadModelEpic(modelName: string) {
    return (action$: Observable<TPayloadAction>, store: NgRedux<IAppState>): Observable<FSA<IModel[], IModelMeta>> =>
      action$
        .filter(
          ({type}) => (type == ModelActions.DELETE_MODEL_COMPLETED
          || type == ModelActions.CREATE_MODEL_COMPLETED
          || type == ModelActions.UPDATE_MODEL_COMPLETED)
        )
        .filter(({meta}) => meta['modelName'] === modelName)
        .switchMap(({payload}) => Observable.interval(1000).startWith(0).timeInterval().take(5)
          .mergeMap(() => this.modelService.list(modelServiceOptions[modelName], payload&&payload['q'])
            .map(data => this.modelActions.listModelCompleted(modelName, data.list))
            .catch(error => Observable.of(this.modelActions.modelError(modelName, error)))
          ).finally(() => store.dispatch(this.modelActions.endReloading(modelName))))
  }

  createReadModelEpic(modelName: string) {
    return (action$: Observable<TPayloadAction>): Observable<FSA<IModel, IModelMeta>> =>
      action$
        .filter(({type}) => type === ModelActions.READ_MODEL)
        .filter(({meta}) => meta['modelName'] === modelName)
        .switchMap(({payload}) => this.modelService.read(modelServiceOptions[modelName], payload)
          .map(data => this.modelActions.readModelCompleted(modelName, data))
          .catch(error => Observable.of(this.modelActions.modelError(modelName, error)))
        )
  }

  createCreateModelEpic(modelName: string) {
    return (action$: Observable<TPayloadAction>, store: NgRedux<IAppState>): Observable<FSA<IModel, IModelMeta>> =>
      action$
        .filter(({type}) => type === ModelActions.CREATE_MODEL)
        .filter(({meta}) => meta['modelName'] === modelName)
        .switchMap(() => this.modelService.create(modelServiceOptions[modelName], store.getState().admin[modelName]['form'])
          .map(data => this.modelActions.createModelCompleted(modelName, data))
          .catch(error => Observable.of(this.modelActions.modelError(modelName, error)))
        )
  }

  createUpdateModelEpic(modelName: string) {
    return (action$: Observable<TPayloadAction>, store: NgRedux<IAppState>): Observable<FSA<IModel, IModelMeta>> =>
      action$
        .filter(({type}) => type === ModelActions.UPDATE_MODEL)
        .filter(({meta}) => meta['modelName'] === modelName)
        .switchMap(({payload}) => this.modelService.update(modelServiceOptions[modelName], payload, store.getState().admin[modelName]['form'])
          .map(data => this.modelActions.updateModelCompleted(modelName, data))
          .catch(error => Observable.of(this.modelActions.modelError(modelName, error)))
        )
  }

  createDeleteModelEpic(modelName: string) {
    return (action$: Observable<TPayloadAction>): Observable<FSA<void, IModelMeta>> =>
      action$
        .filter(({type}) => type === ModelActions.DELETE_MODEL)
        .filter(({meta}) => meta['modelName'] === modelName)
        .switchMap(({payload}) => this.modelService.del(modelServiceOptions[modelName], payload)
          .map(data => this.modelActions.deleteModelCompleted(modelName, data))
          .catch(error => Observable.of(this.modelActions.modelError(modelName, error)))
        )
  }


}
