import {FSA} from './flux-standard';
import {IModelStore} from './model';
import {ISquareStore} from './square';

export * from './model';
export * from './square';
export * from './flux-standard';

export type TPayloadAction =
  FSA<any
    , void
    | {[key: string]: any}>

export interface IAppState {
  admin: {
    query: IModelStore,
    report: IModelStore,
    global_key: IModelStore,
    global_value: IModelStore,
    user: IModelStore
  }
  square: ISquareStore,
  auth: any
}

