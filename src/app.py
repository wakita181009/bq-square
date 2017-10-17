# -*- coding: utf-8 -*-

import webapp2
import logging
import os
from plugins.rest import RESTHandler
from plugins.user import UserRESTHandler

from .handlers import GetReportHandler, GetReportListHandler, GetGlobalKeyValueHandler, RunQueryHandler
from .auth import AuthHandler
from .setup import SetupAuthorizationHandler, SetupHandler

PROD = os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
CLIENT = os.environ['CLIENT']

config = {
    'AUTH': {
        'user_model': 'src.user.UserModel',
        'access_authorizations': {
            'admin': [
                r'^/api/v1/.*$',
                r'^/getReport/.*',
                r'^/getReportList$',
                r'^/getGlobalKeyValue/.*$',
                r'^/run_query/.*$'
            ],
            # 'editor': [
            #     r'^/api/v1/query',
            #     r'^/api/v1/report',
            #     r'^/report_info',
            #     r'^/run_query'
            # ],
            'viewer': [
                r'^/getReport/.*$',
                r'^/getReportList$',
                r'^/getGlobalKeyValue/.*$',
                r'^/run_query/.*$'
            ]
        }
    }
}

app = webapp2.WSGIApplication([
    UserRESTHandler("/api/v1/user"),
    RESTHandler("/api/v1/query", model="src.models.QueryModel"),
    RESTHandler("/api/v1/report", model="src.models.ReportModel"),
    RESTHandler("/api/v1/global_key", model="src.models.GlobalKeyModel"),
    RESTHandler("/api/v1/global_value", model="src.models.GlobalValueModel"),

    webapp2.Route('/setup_authorization', SetupAuthorizationHandler, name='setup_authorization'),
    webapp2.Route('/setup', SetupHandler, name='setup'),
    webapp2.Route('/auth', AuthHandler, name='auth'),

    webapp2.Route('/getReport/<url_safe:([a-zA-z0-9_-]+)|>', GetReportHandler, name='getReport'),
    webapp2.Route('/getReportList', GetReportListHandler, name='getReportList'),
    webapp2.Route('/getGlobalKeyValue/<key_name:([a-zA-z0-9_-]+)|>', GetGlobalKeyValueHandler, name='getGlobalKeyValue'),

    webapp2.Route('/run_query/<query_id:([a-zA-z0-9_-]+)|>', RunQueryHandler, name='run_query'),
    webapp2.Route('/run_query/<query_id:([a-zA-z0-9_-]+)|>/<t:table|plot|chart|>', RunQueryHandler,
                  name='run_query_with_type'),
], debug=(not PROD), config=config)


def handle_error(request, response, e):
    if isinstance(e, Exception):
        logging.exception('[ERROR HANDLER] %s: %s' % (type(e).__name__, e.message))
    else:
        logging.exception('[ERROR HANDLER] %s' % e)

    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = CLIENT
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    response.write(e)
    response.set_status(e.code)


def handle_server_error(request, response, e):
    if isinstance(e, Exception):
        logging.exception('[ERROR HANDLER] %s: %s' % (type(e).__name__, e.message))
    else:
        logging.exception('[ERROR HANDLER] %s' % e)

    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = CLIENT
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    response.write('Server error')
    response.set_status(500)


def handle_not_found_error(request, response, e):
    if isinstance(e, Exception):
        logging.exception('[ERROR HANDLER] %s: %s' % (type(e).__name__, e.message))
    else:
        logging.exception('[ERROR HANDLER] %s' % e)

    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Origin'] = CLIENT
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    response.write('Not found')
    response.set_status(404)


app.error_handlers[403] = handle_error
app.error_handlers[404] = handle_not_found_error
app.error_handlers[400] = handle_error

if PROD:
    app.error_handlers[500] = handle_server_error
