export interface ISquareItem {
  name: string,
  size: string,
  type: string,
  multi?: true,
  query_url: string,
  format?: any[],
  override_params?: {[key: string]: string},
  result?: {
    x: string[],
    y: string[],
    type: string,
    name: string
  }[],
  loading?: boolean
}

export interface ISquare {
  urlsafe: string,
  name: string,
  description: string,
  items: ISquareItem[],
  run?: boolean,
}

export interface ISquareList {
  count: number,
  list: ISquare[]
}

export interface IGlobalValue {
  id: string,
  display_name: string
}

export interface IGlobal {
  id: string,
  display_name: string,
  value?: Date | string,
  _predefined?: IGlobalValue[]
}

export interface ISquareStore {
  active: ISquare,
  items: ISquareList,
  global: {[key: string]: IGlobal},
  ready: boolean,
  loading: boolean,
  error: any
}


