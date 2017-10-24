# -*- coding: utf-8 -*-
import re
import os
import json
import webapp2
from webapp2_extras.routes import NamePrefixRoute
from google.appengine.ext import ndb
from oauth2client import client, crypt
from src.plugins.base_models import BaseExpandoModelWithUnique

from .rest import BaseRESTHandler, RESTVersionError

GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
OWNER = os.environ['OWNER']


def verify_google_token(token):
    try:
        idinfo = client.verify_id_token(token, GOOGLE_CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = client.verify_id_token(token, None)
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #    raise crypt.AppIdentityError("Unrecognized client.")

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise crypt.AppIdentityError("Wrong issuer.")

            # If auth request is from a G Suite domain:
            # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            #    raise crypt.AppIdentityError("Wrong hosted domain.")
    except crypt.AppIdentityError:
        # Invalid token
        return False, None
    return True, idinfo


class UserModel(BaseExpandoModelWithUnique):
    name = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)
    role = ndb.StringProperty(required=True,
                              default="viewer",
                              choices=["owner", "admin", "editor", "view_admin", "viewer"])

    UNIQUE_PROPERTIES = ["email"]

    @classmethod
    def get_by_google_token(cls, google_token):
        ok, idinfo = verify_google_token(google_token)

        if ok:
            email = idinfo["email"]
            user = cls.query(cls.email == email).get()
            return user

        return None

    @classmethod
    def update(cls, urlsafe, **values):
        if values.get('email'):
            raise ValueError("You can't update email property")

        return super(UserModel, cls).update(urlsafe, **values)


def admin_user_required(handler):
    def check_signin(self, *args, **kwargs):
        user = self.user
        if user:
            role = user.role
            if role == "owner" or role == "admin":
                return handler(self, *args, **kwargs)

            return self.handle_error_string('You cannot access this resource.', 403)
        else:
            return self.handle_error_string('You need login.', 403)

    return check_signin


def get_user_rest_class(version, **kwargs):
    class RESTHandlerStore(BaseRESTHandler):

        __version__ = "v1"

        @webapp2.cached_property
        def model(self):
            return self.user_model

        @admin_user_required
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

        @admin_user_required
        def post(self, url_safe=None):
            if url_safe:
                return self.handle_error_string("Cannot POST to a specific model ID")

            try:
                # Parse POST data as JSON
                json_data = json.loads(self.request.body)
            except ValueError as e:
                return self.handle_error(e)

            if json_data['role'] == 'owner':
                return self.handle_error_string("You can't create a owner", 403)

            try:
                future = ndb.transaction(lambda: self.model.create(**json_data), xg=True)
            except Exception as e:
                return self.handle_error(e)

            return self.handle_json(self.model.model_to_dict(future))

        @admin_user_required
        def put(self, url_safe):
            if not url_safe:
                return self.handle_error_string("Need to put a specific ID!")

            try:
                # Parse POST data as JSON
                json_data = json.loads(self.request.body)
            except ValueError as e:
                return self.handle_error(e)

            if json_data.get("role") == 'owner':
                return self.handle_error_string("You can't update OWNER here", 403)

            try:
                future = ndb.transaction(lambda: self.model.update(url_safe, **json_data), xg=True)
            except Exception as e:
                return self.handle_error(e)

            return self.handle_json(self.model.model_to_dict(future))

        @admin_user_required
        def delete(self, url_safe):
            if not url_safe:
                return self.handle_error_string("Need to put a specific ID!")

            model_dict = self.model.model_to_dict(self.model.get_by_urlsafe(url_safe))
            if model_dict.get("role") == "owner":
                return self.handle_error_string("You can't delete a user", 403)

            _permanent = self.request.GET.get('permanent', False)
            if _permanent:
                try:
                    self.model.delete_permanent(url_safe)
                    return self.handle_json({})
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


class UserRESTHandler(NamePrefixRoute):
    URL_PATTERN = re.compile(r"^.*/(v\d)/.*$")

    def __init__(self, url, **kwargs):

        url, version = self._check_rest_url(url)

        routes = [
            # Make sure we catch both URLs: to '/mymodel' and to '/mymodel/123'
            webapp2.Route(url, get_user_rest_class(version, **kwargs), 'main'),
            webapp2.Route(url + '/' + '<url_safe:([a-zA-z0-9_-]+)|>', get_user_rest_class(version, **kwargs),
                          'main'),
            webapp2.Route(url + '/' + '<url_safe:([a-zA-z0-9_-]+)|>/', get_user_rest_class(version, **kwargs),
                          'main')
        ]

        super(UserRESTHandler, self).__init__('rest-handler-', routes)

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
