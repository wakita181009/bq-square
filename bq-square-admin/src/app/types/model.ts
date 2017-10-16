export interface IModelServiceOptions {
  name: string,
  updatable_properties: string[]
}

export const modelServiceOptions: {[key: string]: IModelServiceOptions} = {
  query: {
    name: 'query',
    updatable_properties: ['name', 'query_str', 'cache', 'destination_table']
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
  error: any
}

export const modelInitialState: {[key: string]: IModelStore} = {
  query: {
    items: [],
    loading: false,
    reloading: false,
    form: {
      id: "",
      name: "",
      query_str: "",
      cache: true
    },
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
    error: null
  },
  key_value: {
    items: [],
    loading: false,
    reloading: false,
    form: {
      values: []
    },
    error: null
  },
  global_key: {
    items: [],
    loading: false,
    reloading: false,
    form: {
    },
    error: null
  },
  global_value: {
    items: [],
    loading: false,
    reloading: false,
    form: {
    },
    error: null
  }
};
