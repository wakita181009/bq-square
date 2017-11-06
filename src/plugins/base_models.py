# -*- coding: utf-8 -*-
import datetime
from google.appengine.ext import ndb

from .unique_model import Unique, UniqueModelError


class BaseExpandoModel(ndb.Expando):
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    deleted = ndb.BooleanProperty(default=False)

    @staticmethod
    def get_by_urlsafe(urlsafe):
        try:
            return ndb.Key(urlsafe=urlsafe).get()
        except Exception as e:
            raise e

    @classmethod
    def create(cls, **values):
        values = cls._pre_create_hook(values)
        try:
            _model_key = cls(**values).put()
        except Exception as e:
            raise e

        return _model_key.get()

    @classmethod
    def read(cls, urlsafe):
        _model = cls.get_by_urlsafe(urlsafe)

        if _model is None:
            raise ValueError("Wrong URL SAFE KEY!")
        if _model.deleted:
            # Deleted
            raise ValueError("This model has been deleted!")

        return _model

    @classmethod
    def list(cls, query=None, orders=None, limit=None, cursor=None, offset=None):
        try:
            if query:
                q = cls.gql("WHERE deleted=FALSE AND " + query)
            else:
                q = cls.query(cls.deleted == False)

            if orders:
                orders.append(cls._key)
                q = q.order(*orders)
            else:
                q = q.order(-cls.created, cls._key)

            if limit:
                result, next_cursor, more = q.fetch_page(limit, start_cursor=cursor, offset=offset)
            else:
                result = q.fetch()
                next_cursor = None
                more = False

            ct = q.count()

            return result, next_cursor, more, ct
        except Exception as e:
            raise e

    @classmethod
    def list_distinct_property(cls, p):
        prop = cls._properties[p]
        q = cls.query(projection=[prop], distinct=True)
        models = q.fetch()
        count = q.count()
        return [m.to_dict().get(p)[0] if isinstance(m.to_dict().get(p), list) else m.to_dict().get(p)
                for m in models], count

    @classmethod
    def list_deleted(cls):
        try:
            q = cls.query(cls.deleted == True)
            return q.fetch(), q.count()
        except Exception as e:
            raise e

    @classmethod
    def update(cls, urlsafe, **values):
        _model = cls.get_by_urlsafe(urlsafe)

        if _model is None:
            raise ValueError("Wrong URL SAFE KEY!")
        if _model.deleted:
            # Deleted
            raise ValueError("This model has been deleted!")

        values = cls._pre_update_hook(_model, values)

        for k, v in values.items():
            setattr(_model, k, v)

        try:
            _model_key = _model.put()
        except Exception as e:
            raise e

        return _model_key.get()

    @classmethod
    def _delete_use_flag(cls, urlsafe):
        _model = cls.get_by_urlsafe(urlsafe)

        if _model is None:
            raise ValueError("Wrong URL SAFE KEY!")
        if _model.deleted:
            # Deleted
            raise ValueError("This model has been already deleted!")

        _model.deleted = True

        try:
            _model_key = _model.put()
        except Exception as e:
            raise e

        return _model_key.get()

    @classmethod
    def delete(cls, urlsafe):
        raise TypeError("Delete here is dangerous!")

    @classmethod
    def retrieve(cls, urlsafe):
        _model = cls.get_by_urlsafe(urlsafe)

        if _model is None:
            raise ValueError("Wrong URL SAFE KEY!")
        if not _model.deleted:
            # Deleted
            raise ValueError("This model has not been deleted!")

        _model.deleted = False

        try:
            _model_key = _model.put()
        except Exception as e:
            raise e

        return _model_key.get()

    @classmethod
    def delete_permanent(cls, urlsafe):
        """dangerously
        """
        _model_key = ndb.Key(urlsafe=urlsafe)

        if _model_key is None:
            raise ValueError("Wrong URL SAFE KEY!")

        try:
            _model_key.delete()
            return {}
        except Exception as e:
            raise e

    @classmethod
    def model_to_dict(cls, model):

        if model is None:
            return {}

        if not isinstance(model, cls):
            raise ValueError("This is not a model object!")

        model_dict = model.to_dict()
        model_dict["id"] = model.key.id()
        model_dict["urlsafe"] = model.key.urlsafe()

        return model_dict

    @classmethod
    def models_to_dict_list(cls, models):
        if not isinstance(models, list):
            raise ValueError("objs must be a list")

        models_dict_list = []
        for obj in models:
            obj_dict = cls.model_to_dict(obj)
            models_dict_list.append(obj_dict)

        return models_dict_list

    @classmethod
    def _pre_create_hook(cls, future_values):
        for key, value in future_values.items():
            if (key == ('id' or '_id')) and (cls.get_by_id(value) is not None):
                raise ValueError('ID existed!')
            if key.lower().endswith("date"):
                future_values[key] = cls._pre_date_hook(value)
        return future_values

    @classmethod
    def _pre_update_hook(cls, old_model, future_values):
        for key, value in future_values.items():
            if key == ('id' or '_id'):
                raise ValueError('ID cannot be updated ')
            if key.lower().endswith("date"):
                future_values[key] = cls._pre_date_hook(value)
        return future_values

    @classmethod
    def _pre_date_hook(cls, _date):
        try:
            return datetime.datetime.strptime(_date, "%Y-%m-%d")
        except ValueError as e:
            raise e


class BaseExpandoModelWithUnique(BaseExpandoModel):
    # DEFAULT: name property is unique
    UNIQUE_PROPERTIES = ["name"]
    unique_model = Unique

    @classmethod
    def create(cls, **values):
        values, uniques = cls._pre_create_hook(values)
        try:
            _model_key = cls(**values).put()
        except Exception as e:
            # A poor man's "rollback"
            # ndb.delete_multi(ndb.Key(cls.unique_model, k) for k, v in uniques)
            raise e

        _model = _model_key.get()
        return _model

    @classmethod
    def _pre_create_hook(cls, future_values):
        uniques = cls._pre_create_uniques_prep(future_values)

        for key, value in future_values.items():
            if (key == ('id' or '_id')) and (cls.get_by_id(value) is not None):
                raise ValueError('ID existed!')
            if key.lower().endswith("date"):
                future_values[key] = cls._pre_date_hook(value)

        ok, existing = cls.unique_model.create_multi(k for k, v in uniques)
        if not ok:
            properties = [v for k, v in uniques if k in existing]
            raise UniqueModelError("Properties already exit: %s" % ','.join(properties))

        return future_values, uniques

    @classmethod
    def _pre_create_uniques_prep(cls, future_values):
        uniques = []
        for unique in cls.UNIQUE_PROPERTIES:
            if isinstance(unique, tuple):
                if all(future_values.get(u) for u in unique):
                    u_key = "-".join(u for u in unique)
                    u_value = "-".join(future_values[u] for u in unique)
                    unique_key = '%s.%s:%s' % (cls.__name__, u_key, u_value)
                    uniques.append((unique_key, u_value))
            else:
                if future_values.get(unique):
                    unique_key = '%s.%s:%s' % (cls.__name__, unique, future_values[unique])
                    uniques.append((unique_key, unique))

        return uniques

    @classmethod
    def update(cls, urlsafe, **values):
        _model = cls.get_by_urlsafe(urlsafe)

        if _model is None:
            raise ValueError("Wrong URL SAFE KEY!")
        if _model.deleted:
            # Deleted
            raise ValueError("This model has been deleted!")

        values, old_uniques, uniques = cls._pre_update_hook(_model, values)

        try:
            for k, v in values.items():
                setattr(_model, k, v)
            _model_key = _model.put()
        except Exception as e:
            # A poor man's "rollback"
            # print old_uniques, uniques
            # ndb.delete_multi(ndb.Key(cls.unique_model, k) for k, v in uniques)
            # cls.unique_model.create_multi(old_uniques)
            raise e

        _model = _model_key.get()
        return _model

    @classmethod
    def _pre_update_hook(cls, old_model, future_values):

        old_uniques, uniques = cls._pre_update_uniques_prep(old_model, future_values)

        for key, value in future_values.items():
            if key.lower().endswith("date"):
                future_values[key] = cls._pre_date_hook(value)

        delete_old_uniques_result = cls.unique_model.delete_multi(old_uniques)
        if uniques and any(r is not None for r in delete_old_uniques_result):
            raise UniqueModelError("Cannot delete old unique entity")

        ok, existing = cls.unique_model.create_multi(k for k, v in uniques)

        if not ok:
            properties = [v for k, v in uniques if k in existing]
            raise UniqueModelError("Properties already exit: %s" % ','.join(properties))

        return future_values, old_uniques, uniques

    @classmethod
    def _pre_update_uniques_prep(cls, old_model, future_values):
        old_uniques = []
        uniques = []
        old_model_dict = cls.model_to_dict(old_model)
        for unique in cls.UNIQUE_PROPERTIES:
            if isinstance(unique, tuple):
                if all(future_values.get(u) for u in unique):
                    old_u_key = "-".join(u for u in unique)
                    old_u_value = "-".join(old_model_dict.get(u, "") for u in unique)
                    if old_u_value:
                        old_unique_key = '%s.%s:%s' % (cls.__name__, old_u_key, old_u_value)
                        old_uniques.append(old_unique_key)

                    u_key = "-".join(u for u in unique)
                    u_value = "-".join(future_values[u] for u in unique)
                    unique_key = '%s.%s:%s' % (cls.__name__, u_key, u_value)
                    uniques.append((unique_key, u_value))

            else:
                if future_values.get(unique):
                    old_u_value = old_model_dict.get(unique)
                    if old_u_value:
                        old_unique_key = '%s.%s:%s' % (cls.__name__, unique, old_u_value)
                        old_uniques.append(old_unique_key)

                    unique_key = '%s.%s:%s' % (cls.__name__, unique, future_values[unique])
                    uniques.append((unique_key, unique))

        return old_uniques, uniques

    @classmethod
    def delete_permanent(cls, urlsafe):
        _model_key = ndb.Key(urlsafe=urlsafe)

        old_uniques = []
        _model = _model_key.get()
        if not _model:
            raise ValueError("Wrong URL SAFE KEY!")

        _model_dict = cls.model_to_dict(_model)

        for unique in cls.UNIQUE_PROPERTIES:
            if isinstance(unique, tuple):
                old_u_key = "-".join(u for u in unique)
                old_u_value = "-".join(_model_dict.get(u, "") for u in unique)
                if old_u_value:
                    old_unique_key = '%s.%s:%s' % (cls.__name__, old_u_key, old_u_value)
                    old_uniques.append(old_unique_key)

            else:
                old_u_value = _model_dict.get(unique)
                if old_u_value:
                    old_unique_key = '%s.%s:%s' % (cls.__name__, unique, old_u_value)
                    old_uniques.append(old_unique_key)

        delete_old_uniques_result = cls.unique_model.delete_multi(old_uniques)
        if any(r is not None for r in delete_old_uniques_result):
            raise UniqueModelError("Cannot delete old unique entity")

        try:
            _model_key.delete()
            return {}
        except Exception as e:
            raise e
