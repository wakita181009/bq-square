# -*- coding: utf-8 -*-
import re
import os
import json
import webapp2
from google.appengine.ext import ndb
from webapp2_extras.routes import NamePrefixRoute

from .base_handler import BaseHandler, user_required, import_class

CLIENT = os.environ['CLIENT']


class RESTException(Exception):
    """REST methods exception"""
    pass


class RESTVersionError(Exception):
    pass


class BaseRESTHandler(BaseHandler):
    __version__ = ""

    # toDo Complete query

    def options(self, url_safe=None):
        pass

    def _build_next_query_url(self, cursor):
        return

    def _filter_query(self):
        """Filters the query results for given property filters (if provided by user)."""
        q = self.request.GET.get('q')
        return q

    def _order_query(self):
        if not self.request.GET.get('o'):
            # No order given
            return

        else:
            try:
                # The order parameter is formatted as 'col1, -col2, col3'
                orders = [o.strip() for o in self.request.GET.get('o').split(',')]
                orders = ['+' + o if not o.startswith('-') and not o.startswith('+') else o for o in orders]

                # Translate property names (if it's defined for the current model) - e.g. input 'col1' is actually 'my_col1' in MyModel
                translated_orders = dict([order.lstrip('-+'), order[0]] for order in orders)

                orders = [-getattr(self.model, order) if direction == '-' else getattr(self.model, order) for
                          order, direction in translated_orders.iteritems()]

            except AttributeError, exc:
                # Invalid column name
                raise RESTException('Invalid "order" parameter - %s' % self.request.GET.get('o'))

        # Always use a sort-by-key order at the end - this solves the case where the query uses IN or != operators - since we're using a cursor
        # to fetch results - there is a requirement for this solution in order for the fetch_page to work. See "Query cursors" at
        # https://developers.google.com/appengine/docs/python/ndb/queries
        orders.append(self.model.key)

        return orders


def get_rest_class(ndb_model, version, **kwargs):
    class RESTHandlerStore(BaseRESTHandler):

        __version__ = "v1"

        @webapp2.cached_property
        def model(self):
            return import_class(ndb_model)

        @user_required
        def get(self, url_safe=None):
            if not url_safe:
                _deleted = self.request.GET.get('deleted', False)
                query = self._filter_query()
                orders = self._order_query()
                try:
                    if not _deleted:
                        future = self.model.list(query, orders)
                    else:
                        future = self.model.list_deleted()
                except Exception as e:
                    return self.handle_error(e)

                if future:
                    count = future.count()
                    # finish query
                    future = future.fetch()

                    return self.handle_json({"count": count,
                                             "list": self.model.models_to_dict_list(future)
                                             })
                else:
                    return self.handle_json({"count": 0,
                                             "list": []})

            try:
                future = self.model.read(url_safe)
            except Exception as e:
                return self.handle_error(e)

            return self.handle_json(self.model.model_to_dict(future))

        @user_required
        def post(self, url_safe=None):
            if url_safe:
                return self.handle_error_string("Cannot POST to a specific model ID")

            try:
                # Parse POST data as JSON
                json_data = json.loads(self.request.body)
            except ValueError as e:
                return self.handle_error(e)

            try:
                future = ndb.transaction(lambda: self.model.create(**json_data), xg=True)
            except Exception as e:
                return self.handle_error(e)

            return self.handle_json(self.model.model_to_dict(future))

        @user_required
        def put(self, url_safe):
            if not url_safe:
                return self.handle_error_string("Need to put a specific ID!")

            try:
                # Parse POST data as JSON
                json_data = json.loads(self.request.body)
            except ValueError as e:
                return self.handle_error(e)

            try:
                future = ndb.transaction(lambda: self.model.update(url_safe, **json_data), xg=True)
            except Exception as e:
                return self.handle_error(e)

            return self.handle_json(self.model.model_to_dict(future))

        @user_required
        def delete(self, url_safe):
            if not url_safe:
                return self.handle_error_string("Need to put a specific ID!")

            _permanent = self.request.GET.get('permanent', False)
            if _permanent:
                try:
                    result = self.model.delete_permanent(url_safe)
                    return self.handle_json(result)
                except Exception as e:
                    return self.handle_error(e)

            _retrieve = self.request.GET.get('retrieve', False)
            if _retrieve:
                try:
                    future = self.model.retrieve(url_safe)
                except Exception as e:
                    return self.handle_error(e)
            else:
                try:
                    future = self.model.delete(url_safe)
                except Exception as e:
                    return self.handle_error(e)

            return self.handle_json(self.model.model_to_dict(future))

    if RESTHandlerStore.__version__ == version:
        return RESTHandlerStore
    else:
        raise RESTVersionError("this version isn't supported")


class RESTHandler(NamePrefixRoute):
    URL_PATTERN = re.compile(r"^.*/(v\d)/.*$")

    def __init__(self, url, model, **kwargs):

        url, version = self._check_rest_url(url)
        model = import_class(model)

        routes = [
            # Make sure we catch both URLs: to '/mymodel' and to '/mymodel/123'
            webapp2.Route(url, get_rest_class(model, version, **kwargs), 'main'),
            webapp2.Route(url + '/' + '<url_safe:([a-zA-z0-9_-]+)|>', get_rest_class(model, version, **kwargs),
                          'main'),
            webapp2.Route(url + '/' + '<url_safe:([a-zA-z0-9_-]+)|>/', get_rest_class(model, version, **kwargs),
                          'main')
        ]

        super(RESTHandler, self).__init__('rest-handler-', routes)

    @classmethod
    def _check_rest_url(cls, url):
        url = url.rstrip(' /')
        if not url.startswith('/'):
            raise ValueError('RESHandler url should start with "/": %s' % url)

        match = cls.URL_PATTERN.match(url)
        try:
            version = match.group(1)
        except AttributeError:
            raise ValueError('RESHandler url should include version: %s' % url)
        else:
            return url, version
