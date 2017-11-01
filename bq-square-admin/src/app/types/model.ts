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
    updatable_properties: ['name', 'data_source_id', 'query_str', 'cache', 'destination_table']
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
  count: number
}

export interface IModelStore {
  items: IModel[];
  loading: boolean;
  reloading: boolean;
  form: IModel,
  message: any,
  error: any
}

export const modelInitialState: {[key: string]: IModelStore} = {
  data_source: {
    items: [],
    loading: false,
    reloading: false,
    form: {
      type: "bigquery"
    },
    message: null,
    error: null
  },
  query: {
    items: [],
    loading: false,
    reloading: false,
    form: {
      id: "",
      name: "",
      data_source_id: "bigquery",
      query_str: "",
      cache: true
    },
    message: null,
    error: null
  },
  report: {
    items: [],
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
    items: [],
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
    items: [],
    loading: false,
    reloading: false,
    form: {
      values: []
    },
    message: null,
    error: null
  },
  global_key: {
    items: [],
    loading: false,
    reloading: false,
    form: {},
    message: null,
    error: null
  },
  global_value: {
    items: [],
    loading: false,
    reloading: false,
    form: {},
    message: null,
    error: null
  }
};
