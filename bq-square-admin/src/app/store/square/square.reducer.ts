import {SquareActions} from './square.actions';
import {TPayloadAction} from '../../types';
import {Reducer} from 'redux';

import {tassign} from 'tassign';
import {assocPath, merge} from 'ramda';
import {ISquareStore} from "app/types/square";
import {yestoday, lastWeekFromYestoday} from 'app/utils/date';

export const squareInitialState: ISquareStore = {
  active: null,
  items: [],
  global: {
    start_date: {
      id: 'start_date',
      display_name: 'Start Date',
      value: lastWeekFromYestoday()
    },
    end_date: {
      id: 'end_date',
      display_name: 'End Date',
      value: yestoday()
    }
  },
  ready: false,
  loading: false,
  error: null
};

export const squareReducer: Reducer<ISquareStore> =
  (state: ISquareStore = squareInitialState, action: TPayloadAction) => {
    switch (action.type) {
      case SquareActions.READ_SQUARE:
        return tassign(
          state,
          {
            loading: true
          }
        );
      case SquareActions.READ_SQUARE_COMPLETED:
        return tassign(
          state,
          {
            active: action.payload,
            loading: false
          }
        );
      case SquareActions.LIST_SQUARE_COMPLETED:
        return tassign(
          state,
          {
            items: action.payload['list']
          }
        );
      case SquareActions.RUN_ALL_QUERY:
        for (let i = 0; i < state.active.items.length; i++) {
          if (state.active.items[i]['type'].indexOf('input_') !== 0) {
            state = assocPath(
              ['active', 'items', i, 'loading'],
              true,
              state
            );
          }
        }
        return assocPath(
          ['active', 'run'],
          true,
          state
        );
      case SquareActions.RUN_QUERY_COMPLETED:
        if (!state.active.items[action.payload['index']]) return state;
        return assocPath(
          ['active', 'items', action.payload['index'], 'loading'],
          false,
          assocPath(
            ['active', 'items', action.payload['index'], 'result'],
            action.payload['result'],
            state
          )
        );
      case SquareActions.RUN_QUERY_ERROR:
        return assocPath(
          ['active', 'items', action.payload['index'], 'loading'],
          false,
          assocPath(
            ['active', 'items', action.payload['index'], 'result'],
            {error: action.payload['error_msg']},
            state
          )
        );
      case SquareActions.SQUARE_ERROR:
        return tassign(
          state,
          {
            error: action.payload,
            loading: false
          }
        );
      case SquareActions.GET_GLOBAL_KEY_VALUE:
        return tassign(
          state,
          {
            ready: false
          }
        );
      case SquareActions.GET_GLOBAL_KEY_VALUE_COMPLETED:
        let payload = action.payload;
        if (payload._predefined) payload.value = payload._predefined[0] && payload._predefined[0]['id'];
        state.global[payload.id] = payload;
        return tassign(
          state,
          {
            ready: true
          }
        );
      case SquareActions.GLOBAL_CHANGED:
        return assocPath(
          ['global'],
          action.payload,
          state
        );
      default:
        return state
    }

  };
