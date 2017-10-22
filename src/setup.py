# -*- coding: utf-8 -*-
import json
import os
from .plugins.base_handler import BaseHandler
from .plugins.user import verify_google_token
from google.appengine.ext import ndb
from .models import DataSourceModel, QueryModel, ReportModel, GlobalKeyModel

GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
OWNER = os.environ['OWNER']


class SetupAuthorizationHandler(BaseHandler):
    def post(self):
        try:
            json_data = json.loads(self.request.body)
        except ValueError as e:
            return self.handle_error(e)

        google_token = json_data['google_token']

        ok, idinfo = verify_google_token(google_token)
        if ok and idinfo["email"] == OWNER:
            if self.user_model.query().count() != 0:
                return self.handle_error_string("You have already setup.", 403)
            return self.handle_json(idinfo)

        return self.handle_error_string("", 403)


class SetupHandler(BaseHandler):
    def post(self):
        try:
            json_data = json.loads(self.request.body)
        except ValueError as e:
            return self.handle_error(e)

        google_token = json_data['google_token']

        ok, idinfo = verify_google_token(google_token)

        if ok and idinfo["email"] == OWNER:
            if self.user_model.query().count() != 0:
                return self.handle_error_string("You have already setup.", 403)

            user = {
                'google_id': idinfo['sub'],
                'google_image_url': idinfo['picture'],
                'email': idinfo['email'],
                'google_given_name': idinfo['given_name'],
                'google_family_name': idinfo['family_name'],
                'google_name': idinfo['name'],
                'name': json_data['name'],
                'role': 'owner'
            }

            try:
                future = self.user_model.create(**user)
            except Exception as e:
                return self.handle_error(e)

            data_source = {
                "id": "bigquery",
                "type": "bigquery"
            }

            ndb.transaction(lambda: DataSourceModel.create(**data_source), xg=True)

            query = {
                "id": "test",
                "name": "TEST",
                "data_source_id": "bigquery",
                "query_str": """
SELECT SUM(totals.pageviews) as TotalPageviews
FROM `google.com:analytics-bigquery.LondonCycleHelmet.ga_sessions_20130910`
                """,
                "cache": True
            }
            ndb.transaction(lambda: QueryModel.create(**query), xg=True)

            _format = {
                "format": [
                    {
                        "size": "full",
                        "type": "input_date"
                    },
                    {
                        "name": "TEST",
                        "size": "half",
                        "type": "table",
                        "query_url": "/run_query/test",
                        "format": {
                        }
                    }
                ]
            }

            report = {
                "name": "Dashboard",
                "tag": [],
                "format": json.dumps(_format),
                "urlsafe": "ahVkZXZ-Zm91ci1tYXJrZXQtcGxhY2VyGAsSC1JlcG9ydE1vZGVsIgdkZWZhdWx0DA",
                "description": "First Dashboard for Test",
                "id": "default", "order": 100
            }
            ndb.transaction(lambda: ReportModel.create(**report), xg=True)

            global_key_start_date = {
                "id": "start_date",
                "display_name": "Start Date",
                "type": "FREEFORM"
            }
            ndb.transaction(lambda: GlobalKeyModel.create(**global_key_start_date))
            global_key_end_date = {
                "id": "end_date",
                "display_name": "End Date",
                "type": "FREEFORM"
            }
            ndb.transaction(lambda: GlobalKeyModel.create(**global_key_end_date))

            return self.handle_json(self.user_model.model_to_dict(future))

        return self.handle_error_string("", 403)
