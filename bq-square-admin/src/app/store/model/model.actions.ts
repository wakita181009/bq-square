import {Injectable} from '@angular/core';

import {FSA, IModel, IModelMeta} from 'app/types';

interface IPushArrayItemPayload {
  path: string[],
  value: any
}

interface IRemoveArrayItemPayload {
  path: string[],
  index: number
}


@Injectable()
export class ModelActions {
  constructor() {
  }

  static readonly LIST_MODEL = 'LIST_MODEL';
  static readonly LIST_MODEL_COMPLETED = 'LIST_MODEL_COMPLETED';
  static readonly CREATE_MODEL = "CREATE_MODEL";
  static readonly CREATE_MODEL_COMPLETED = "CREATE_MODEL_COMPLETED";
  static readonly READ_MODEL = "READ_MODEL";
  static readonly READ_MODEL_COMPLETED = 'READ_MODEL_COMPLETED';
  static readonly UPDATE_MODEL = "UPDATE_MODEL";
  static readonly UPDATE_MODEL_COMPLETED = "UPDATE_MODEL_COMPLETED";
  static readonly DELETE_MODEL = "DELETE_MODEL";
  static readonly DELETE_MODEL_COMPLETED = "DELETE_MODEL_COMPLETED";
  static readonly END_RELOADING = "END_RELOADING";
  static readonly NEW_FORM = "NEW_FORM";
  static readonly MODEL_ERROR = "MODEL_ERROR";

  static readonly PUSH_ARRAY_ITEM = "PUSH_ARRAY_ITEM";
  static readonly REMOVE_ARRAY_ITEM = "REMOVE_ARRAY_ITEM";

  static readonly REMOVE_ITEMS = "REMOVE_ITEMS";

  listModel(modelName: string, payload?: any): FSA<any, IModelMeta> {
    return {
      type: ModelActions.LIST_MODEL,
      meta: {modelName},
      payload
    }
  }

  listModelCompleted(modelName: string, payload: IModel[]): FSA<IModel[], IModelMeta> {
    return {
      type: ModelActions.LIST_MODEL_COMPLETED,
      meta: {modelName},
      payload
    }
  }

  createModel(modelName: string): FSA<void, IModelMeta> {
    return {
      type: ModelActions.CREATE_MODEL,
      meta: {modelName}
    }
  }

  createModelCompleted(modelName: string, payload: IModel): FSA<IModel, IModelMeta> {
    return {
      type: ModelActions.CREATE_MODEL_COMPLETED,
      meta: {modelName},
      payload
    }
  }

  readModel(modelName: string, payload: string): FSA<string, IModelMeta> {
    return {
      type: ModelActions.READ_MODEL,
      meta: {modelName},
      payload
    }
  }

  readModelCompleted(modelName: string, payload: IModel): FSA<IModel, IModelMeta> {
    return {
      type: ModelActions.READ_MODEL_COMPLETED,
      meta: {modelName},
      payload
    }
  }

  updateModel(modelName: string, payload: string): FSA<string, IModelMeta> {
    return {
      type: ModelActions.UPDATE_MODEL,
      meta: {modelName},
      payload
    }
  }

  updateModelCompleted(modelName: string, payload: IModel): FSA<IModel, IModelMeta> {
    return {
      type: ModelActions.UPDATE_MODEL_COMPLETED,
      meta: {modelName},
      payload
    }
  }

  deleteModel(modelName: string, payload: string): FSA<string, IModelMeta> {
    return {
      type: ModelActions.DELETE_MODEL,
      meta: {modelName},
      payload
    }
  }

  deleteModelCompleted(modelName: string, payload: any): FSA<void, IModelMeta> {
    return {
      type: ModelActions.DELETE_MODEL_COMPLETED,
      meta: {modelName},
      payload
    }
  }

  endReloading(modelName: string): FSA<void, IModelMeta> {
    return {
      type: ModelActions.END_RELOADING,
      meta: {modelName}
    }
  }

  newForm(modelName: string): FSA<IModel, IModelMeta> {
    return {
      type: ModelActions.NEW_FORM,
      meta: {modelName}
    }
  }

  modelError(modelName: string, payload: any): FSA<any, IModelMeta> {
    return {
      type: ModelActions.MODEL_ERROR,
      meta: {modelName},
      payload
    }
  }

  addArrayItem(modelName: string, payload: IPushArrayItemPayload): FSA<IPushArrayItemPayload, IModelMeta> {
    return {
      type: ModelActions.PUSH_ARRAY_ITEM,
      meta: {modelName},
      payload
    }
  }

  removeArrayItem(modelName: string, payload: IRemoveArrayItemPayload): FSA<IRemoveArrayItemPayload, IModelMeta> {
    return {
      type: ModelActions.REMOVE_ARRAY_ITEM,
      meta: {modelName},
      payload
    }
  }

  removeItems(modelName: string): FSA<IModel, IModelMeta> {
    return {
      type: ModelActions.REMOVE_ITEMS,
      meta: {modelName}
    }
  }
}
