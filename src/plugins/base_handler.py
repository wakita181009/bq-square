# -*- coding: utf-8 -*-
import os
import re
import webapp2
from google.appengine.api import memcache
from .utils.to_json import to_json

import jwt
from jwt.contrib.algorithms.pycrypto import RSAAlgorithm
from jwt.contrib.algorithms.py_ecdsa import ECAlgorithm

jwt.register_algorithm('RS256', RSAAlgorithm(RSAAlgorithm.SHA256))
jwt.register_algorithm('ES256', ECAlgorithm(ECAlgorithm.SHA256))

JWT_ALGORITHM = os.environ['JWT_ALGORITHM']
JWT_PUBLIC_KEY = os.environ['JWT_PUBLIC_KEY']
JWT_PRIVATE_KEY = os.environ['JWT_PRIVATE_KEY']
CLIENT = os.environ['CLIENT']

OWNER = os.environ['OWNER']

default_config = {
    'user_model': 'src.user.plugins.UserModel'
}


def import_class(input_cls):
    if not isinstance(input_cls, str):
        # It's a class - return as-is
        return input_cls

    try:
        input_cls = webapp2.import_string(input_cls)
        return input_cls
    except Exception, exc:
        # Couldn't import the class
        raise ValueError("Couldn't import the model class '%s': %s: %s" % (input_cls, Exception, exc))


def user_required(handler):
    def check_signin(self, *args, **kwargs):
        user = self.user
        if user:
            role = user.role
            if role == "owner":
                return handler(self, *args, **kwargs)

            path = self.request.path
            cache_key = "{}:{}".format(role, path)
            if memcache.get(cache_key):
                return handler(self, *args, **kwargs)

            access_authorizations = self.config['access_authorizations']
            my_access_authorizations = access_authorizations.get(role)

            print "======"
            print path, role, my_access_authorizations
            print "======"

            if my_access_authorizations:
                for pattern in my_access_authorizations:
                    result = re.match(pattern, path)
                    if result and result.group(0) == path:
                        memcache.add(cache_key, True, time=1800)
                        return handler(self, *args, **kwargs)

            return self.handle_error_string('You cannot access this resource.', 403)
        else:
            return self.handle_error_string('You need login.', 403)

    return check_signin


class BaseHandler(webapp2.RequestHandler):
    @webapp2.cached_property
    def app(self):
        return webapp2.get_app()

    @webapp2.cached_property
    def config(self):
        return self.app.config.load_config('AUTH', default_values=default_config)

    @webapp2.cached_property
    def user_model(self):
        """Configured user model."""
        cls = self.config['user_model']
        return import_class(cls)

    @webapp2.cached_property
    def user_info(self):
        jwt_token = self.get_jwt_token()
        payload = self.decode_jwt_token(jwt_token)
        return payload

    @webapp2.cached_property
    def user(self):
        user_info = self.user_info
        user_id = user_info.get('id') if user_info else None
        return self.user_model.get_by_id(user_id) if user_id else None

    def get_jwt_token(self):
        jwt_token = self.request.headers.get('Authorization')
        return jwt_token.lstrip("JWT").strip() if jwt_token else None

    @staticmethod
    def decode_jwt_token(jwt_token):
        try:
            return jwt.decode(
                jwt_token, JWT_PUBLIC_KEY, algorithms=[JWT_ALGORITHM])
        except:
            return None

    @staticmethod
    def encode_jwt_token(payload):
        return jwt.encode(payload, JWT_PRIVATE_KEY, JWT_ALGORITHM)

    def handle_error(self, e, status=400):
        self.abort(status, detail='%s: %s' % (type(e).__name__, e.message))

    def handle_error_string(self, s, status=400):
        self.abort(status, detail=s)

    def handle_json(self, obj):
        try:
            self.response.headers[b'Content-Type'] = b'application/json'
            self.response.write(to_json(obj))
        except Exception as e:
            self.handle_error(e)

    def options(self):
        pass

    def dispatch(self):
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
            self.response.headers['Access-Control-Allow-Credentials'] = 'true'
            self.response.headers['Access-Control-Allow-Origin'] = CLIENT
            self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
