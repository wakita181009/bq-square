import {createSelector} from 'reselect';
import {IAppState, IModelStore} from '../types';


export const createModelStateSelector = (modelName: string) =>
  (state: IAppState): IModelStore => state.admin[modelName];

export const createModelLoadingSelector = (modelName: string) =>
  createSelector(
    createModelStateSelector(modelName),
    (modelState: IModelStore) => {
      return modelState.loading || modelState.reloading
    }
  );

export const userEmailsSelector = createSelector(
  createModelStateSelector('user'),
  (userModelState: IModelStore) => {
    let arr = [];
    for (let item of userModelState.items) {
      arr.push(item.email)
    }
    return arr
  }
);
