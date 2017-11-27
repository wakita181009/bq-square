import {ModelActions} from './model.actions';
import {TPayloadAction, IModelStore, modelInitialState, modelListInitialState} from 'app/types';
import {Reducer} from 'redux';

import {tassign} from 'tassign';
import {assocPath, pathOr} from 'ramda';


export function createModelReducer(modelName: string): Reducer<IModelStore> {
  let initialState = modelInitialState[modelName];

  return (state = initialState, action: TPayloadAction) => {
    if (!action.meta || action.meta['modelName'] !== modelName) {
      return state;
    }

    let modelNameStr = action.meta['modelName'].charAt(0).toUpperCase() + action.meta['modelName'].slice(1);

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
            items: tassign(
              state.items,
              action.payload
            ),
            loading: false
          }
        );
      case ModelActions.GET_FILTER_COMPLETED:
        return assocPath(
          ['items', 'filter'],
          tassign(
            state.items.filter,
            action.payload
          ),
          state
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
        return tassign(
          state,
          {
            form: initialState.form,
            loading: false,
            reloading: true,
            message: `${modelNameStr} created. -- ID: ${action.payload['id']}`
          }
        );
      case ModelActions.DELETE_MODEL_COMPLETED:
        return tassign(
          state,
          {
            form: initialState.form,
            loading: false,
            reloading: true,
            message: `${modelNameStr} deleted.`
          }
        );
      case ModelActions.UPDATE_MODEL_COMPLETED:
        return tassign(
          state,
          {
            loading: false,
            reloading: true,
            message: `${modelNameStr} updated. -- ID: ${action.payload['id']}`
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
      case ModelActions.END_RELOADING:
        return tassign(
          state,
          {
            reloading: false
          }
        );
      case ModelActions.NEW_MESSAGE:
        return tassign(
          state,
          {
            message: action.payload,
            loading: false
          }
        );
      case ModelActions.CLEAR_MESSAGE:
        return tassign(
          state,
          {
            message: null,
            loading: false
          }
        );
      case ModelActions.NEW_ERROR:
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
            items: modelListInitialState
          }
        );

      default:
        return state
    }
  }
}
