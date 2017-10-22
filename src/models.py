# -*- coding: utf-8 -*-
from src.plugins.base_models import BaseExpandoModel, BaseExpandoModelWithUnique
from google.appengine.ext import ndb


class DataSourceModel(BaseExpandoModel):
    type = ndb.StringProperty(required=True,
                              choices=['bigquery', 'cloudsql'])
    """
    bigquery
        - id
    cloudsql
        - id
        - cloudsql_connection_name
        - cloudsql_user
        - cloudsql_password
        - cloudsql_db
    """


class QueryModel(BaseExpandoModel):
    name = ndb.StringProperty(required=True)
    data_source_id = ndb.StringProperty(required=True)
    query_str = ndb.TextProperty(required=True)
    cache = ndb.BooleanProperty(default=True, required=True)


class ReportModel(BaseExpandoModel):
    name = ndb.StringProperty(required=True)
    description = ndb.TextProperty()
    tag = ndb.StringProperty(repeated=True)
    format = ndb.TextProperty(required=True)
    order = ndb.IntegerProperty(default=100)


class GlobalKeyModel(BaseExpandoModel):
    display_name = ndb.StringProperty(required=True)
    type = ndb.StringProperty(required=True,
                              default="FREEFORM",
                              choices=["PREDEFINED", "FREEFORM"])


class GlobalValueModel(BaseExpandoModel):
    display_name = ndb.StringProperty(required=True)
    authorized_user_email = ndb.StringProperty(repeated=True)

    @classmethod
    def _pre_create_hook(cls, future_values):
        parent = future_values.get('global_key')
        if not parent:
            raise ValueError("global_key is required!")

        parent_key = ndb.Key(GlobalKeyModel, parent)
        future_values['parent'] = parent_key

        del future_values['global_key']

        return super(GlobalValueModel, cls)._pre_create_hook(future_values)

    @classmethod
    def model_to_dict(cls, model):
        model_dict = super(GlobalValueModel, cls).model_to_dict(model)
        model_dict["q"] = 'ANCESTOR%20is%20Key%28%27GlobalKeyModel%27%2C%20%27{0}%27%29'.format(model.key.parent().id())

        return model_dict

    @classmethod
    def delete_permanent(cls, urlsafe):
        _model_key = ndb.Key(urlsafe=urlsafe)
        _parent_id = _model_key.parent().id()

        if _model_key is None:
            raise ValueError("Wrong URL SAFE KEY!")

        try:
            _model_key.delete()
            return {'q': 'ANCESTOR%20is%20Key%28%27GlobalKeyModel%27%2C%20%27{0}%27%29'.format(_parent_id)}
        except Exception as e:
            raise e
