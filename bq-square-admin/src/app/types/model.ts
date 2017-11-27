export interface IModelServiceOptions {
  name: string,
  updatable_properties: string[]
}

export const modelServiceOptions: {[key: string]: IModelServiceOptions} = {
  data_source: {
    name: 'data_source',
    updatable_properties: ['cloudsql_connection_name', 'cloudsql_user', 'cloudsql_password', 'cloudsql_db']
  },
  query: {
    name: 'query',
    updatable_properties: ['name', 'data_source_id', 'query_str', 'cache', 'tag']
  },
  report: {
    name: 'report',
    updatable_properties: ['name', 'format', 'description', 'tag', 'order']
  },
  user: {
    name: 'user',
    updatable_properties: ['name', 'role', 'authorized_query_id', 'report_id']
  },
  global_key: {
    name: 'global_key',
    updatable_properties: ['display_name']
  },
  global_value: {
    name: 'global_value',
    updatable_properties: ['display_name', 'authorized_user_email']
  }
};

export interface IModelMeta {
  modelName: string
}

export interface IModel {
  [key: string]: any,
  id?: string,
  created?: string,
  updated?: string,
  deleted?: boolean
}

export interface IModelList {
  list: IModel[],
  count: number,
  cursor: string,
  more: boolean,
  filter: {[key: string]: string[]}
}

export interface IModelStore {
  items: IModelList;
  loading: boolean;
  reloading: boolean;
  form: IModel,
  message: any,
  error: any
}

export const modelListInitialState: IModelList= {
  list:[],
  count:0,
  cursor: null,
  more: false,
  filter: {}
};

export const modelInitialState: {[key: string]: IModelStore} = {
  data_source: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {
      type: "bigquery"
    },
    message: null,
    error: null
  },
  query: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {
      id: "",
      name: "",
      data_source_id: "bigquery",
      query_str: "",
      cache: true,
      tag: []
    },
    message: null,
    error: null
  },
  report: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {
      name: "",
      format: ""
    },
    message: null,
    error: null
  },
  user: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {
      name: "",
      email: "",
      role: "viewer"
    },
    message: null,
    error: null
  },
  key_value: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {
      values: []
    },
    message: null,
    error: null
  },
  global_key: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {},
    message: null,
    error: null
  },
  global_value: {
    items: modelListInitialState,
    loading: false,
    reloading: false,
    form: {},
    message: null,
    error: null
  }
};
