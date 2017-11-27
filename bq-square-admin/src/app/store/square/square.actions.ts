import {Injectable} from '@angular/core';

import {FSA} from '../../types/flux-standard';
import {ISquare, ISquareList} from "../../types/square";


@Injectable()
export class SquareActions {
  constructor() {
  }

  static readonly READ_SQUARE = 'READ_SQUARE';
  static readonly READ_SQUARE_COMPLETED = 'READ_SQUARE_COMPLETED';
  static readonly LIST_SQUARE = 'LIST_SQUARE';
  static readonly LIST_SQUARE_COMPLETED = 'LIST_SQUARE_COMPLETED';
  static readonly RUN_ALL_QUERY = 'RUN_ALL_QUERY';
  static readonly RUN_QUERY_COMPLETED = 'RUN_QUERY_COMPLETED';
  static readonly SQUARE_CHANGED = 'SQUARE_CHANGED';
  static readonly RUN_QUERY_ERROR = 'RUN_QUERY_ERROR';
  static readonly SQUARE_ERROR = 'SQUARE_ERROR';

  static readonly GET_GLOBAL_KEY_VALUE = 'GET_GLOBAL_KEY_VALUE';
  static readonly GET_GLOBAL_KEY_VALUE_COMPLETED = 'GET_GLOBAL_KEY_VALUE_COMPLETED';
  static readonly GLOBAL_CHANGED = "GLOBAL_CHANGED";


  readSquare(payload: string): FSA<string, void> {
    return {
      type: SquareActions.READ_SQUARE,
      payload
    }
  }

  readSquareCompleted(payload: ISquare): FSA<ISquare, void> {
    return {
      type: SquareActions.READ_SQUARE_COMPLETED,
      payload
    }
  }

  listSquare(payload?: {[key: string]: string|number|boolean}): FSA<{[key: string]: string|number|boolean}, void> {
    return {
      type: SquareActions.LIST_SQUARE,
      payload
    }
  }

  listSquareCompleted(payload: ISquareList): FSA<ISquareList, void> {
    return {
      type: SquareActions.LIST_SQUARE_COMPLETED,
      payload
    }
  }

  runAllQuery() {
    return {
      type: SquareActions.RUN_ALL_QUERY
    }
  }

  runQueryCompleted(payload: any): FSA<any, void> {
    return {
      type: SquareActions.RUN_QUERY_COMPLETED,
      payload
    }
  }

  squareChanged(): FSA<void, void> {
    return {
      type: SquareActions.SQUARE_CHANGED
    }
  }

  runQueryError(payload: any): FSA<any, void> {
    return {
      type: SquareActions.RUN_QUERY_ERROR,
      payload
    }
  }

  squareError(payload: any): FSA<any, void> {
    return {
      type: SquareActions.SQUARE_ERROR,
      payload
    }
  }

  getGlobalKeyValue(payload: string): FSA<string, void> {
    return {
      type: SquareActions.GET_GLOBAL_KEY_VALUE,
      payload
    }
  }

  getGlobalKeyValueCompleted(payload: any): FSA<any, void> {
    return {
      type: SquareActions.GET_GLOBAL_KEY_VALUE_COMPLETED,
      payload
    }
  }

  globalChanged(payload: any): FSA<any, void> {
    return {
      type: SquareActions.GLOBAL_CHANGED,
      payload
    }
  }
}
