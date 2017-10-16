# -*- coding: utf-8 -*-
from google.appengine.ext import ndb
from src.plugins.user import UserModel as _UserModel


class UserModel(_UserModel):
    authorized_query_id = ndb.StringProperty(repeated=True)
    # authorized_table_name = ndb.StringProperty(repeated=True)
    report_id = ndb.StringProperty(repeated=True)
