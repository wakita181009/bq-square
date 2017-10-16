import {createSelector} from 'reselect';
import {IAppState, ISquareStore} from '../types';

export const squareStateSelector = (state: IAppState): ISquareStore => state.square;

export const squareLoadingSelector = createSelector(
  squareStateSelector,
  state => {
    let items = state.active ? state.active.items : [];
    let loading = false;
    for (let item of items) {
      loading = loading || item.loading
    }
    return loading || state.loading
  }
);
