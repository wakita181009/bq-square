import {ModelActions} from './model.actions';
import {TPayloadAction, IModelStore, modelInitialState} from 'app/types';
import {Reducer} from 'redux';

import {tassign} from 'tassign';
import {assocPath, pathOr} from 'ramda';


export function createModelReducer(modelName: string): Reducer<IModelStore> {
  let initialState = modelInitialState[modelName];

  return (state=initialState, action: TPayloadAction) => {
    if (!action.meta || action.meta['modelName'] !== modelName) {
      return state;
    }

    switch (action.type) {
      case ModelActions.LIST_MODEL:
      case ModelActions.READ_MODEL:
      case ModelActions.CREATE_MODEL:
      case ModelActions.UPDATE_MODEL:
      case ModelActions.DELETE_MODEL:
        return tassign(
          state,
          {loading: true}
        );
      case ModelActions.LIST_MODEL_COMPLETED:
        return tassign(
          state,
          {
            items: action.payload,
            loading: false
          }
        );
      case ModelActions.READ_MODEL_COMPLETED:
        return tassign(
          state,
          {
            form: action.payload,
            loading: false
          }
        );
      case ModelActions.CREATE_MODEL_COMPLETED:
      case ModelActions.DELETE_MODEL_COMPLETED:
        return tassign(
          state,
          {
            form: initialState.form,
            loading: false,
            reloading: true
          }
        );
      case ModelActions.NEW_FORM:
        return tassign(
          state,
          {
            form: initialState.form,
            loading: false
          }
        );
      case ModelActions.UPDATE_MODEL_COMPLETED:
        return tassign(
          state,
          {
            loading: false,
            reloading: true
          }
        );
      case ModelActions.END_RELOADING:
        return tassign(
          state,
          {
            reloading: false
          }
        );
      case ModelActions.MODEL_ERROR:
        return tassign(
          state,
          {
            error: action.payload,
            loading: false
          }
        );
      case ModelActions.CLEAR_ERROR:
        return tassign(
          state,
          {
            error: null,
            loading: false
          }
        );

      case ModelActions.PUSH_ARRAY_ITEM:
        pathOr([], action.payload['path'], state).push(action.payload['value']);
        return state;
      case ModelActions.REMOVE_ARRAY_ITEM:
        pathOr([], action.payload['path'], state).splice(action.payload['index'], 1);
        return state;

      case ModelActions.REMOVE_ITEMS:
        return tassign(
          state,
          {
            items: []
          }
        );

      default:
        return state
    }
  }
}
