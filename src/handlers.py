# -*- coding: utf-8 -*-
import webapp2
import json
import logging
import time
from google.appengine.api import memcache
from jinja2 import Template
from plugins.base_handler import BaseHandler, user_required
from .models import DataSourceModel, QueryModel, ReportModel, GlobalKeyModel, GlobalValueModel
from src.plugins.utils.to_json import to_json
from src.plugins.base_handler import import_class


class GetReportHandler(BaseHandler):
    def options(self, url_safe=None):
        pass

    @user_required
    def get(self, url_safe=None):
        role = self.user.role
        model = ReportModel.get_by_urlsafe(url_safe) if url_safe else ReportModel.get_by_id('default')

        if not model:
            return self.handle_error_string('Wrong report requested')

        if role not in ["owner", "admin", "view_admin"]:
            if model.key.id() not in self.user.report_id:
                self.handle_error_string("You cannot access this report", 403)

        report_format = json.loads(model.format)

        r = {
            'urlsafe': model.key.urlsafe(),
            'name': model.name,
            'description': model.description,
            'items': report_format['format'] if 'format' in report_format else [],
        }

        return self.handle_json(r)


class GetReportListHandler(BaseHandler):
    @user_required
    def get(self):
        role = self.user.role
        if role in ["owner", "admin", "view_admin"]:
            q = ReportModel.list()
            return self.handle_json({
                "count": q.count(),
                "list": ReportModel.models_to_dict_list(q.fetch())
            })

        _report_model_list = [ReportModel.get_by_id(id) for id in self.user.report_id]
        report_model_list = [model for model in _report_model_list if model and model.deleted is False]
        return self.handle_json({
            "count": len(report_model_list),
            "list": ReportModel.models_to_dict_list(report_model_list)
        })


class GetGlobalKeyValueHandler(BaseHandler):
    def options(self, key_name=None):
        pass

    @user_required
    def get(self, key_name):
        global_key = GlobalKeyModel.get_by_id(key_name)
        if not global_key:
            return self.handle_error_string('Wrong key name')
        if global_key.type == "PREDEFINED":
            if self.user.role in ["owner", "admin", "view_admin"]:
                return self.handle_json({
                    "id": global_key.key.id(),
                    "display_name": global_key.display_name,
                    "_predefined": [{"id": v.key.id(), "display_name": v.display_name, } for v in
                                    GlobalValueModel.query(GlobalValueModel.deleted == False,
                                                           ancestor=global_key.key).fetch()]
                })
            else:
                return self.handle_json({
                    "id": global_key.key.id(),
                    "display_name": global_key.display_name,
                    "_predefined": [{"id": v.key.id(), "display_name": v.display_name} for v in
                                    GlobalValueModel.query(GlobalKeyModel.deleted == False,
                                                           GlobalValueModel.authorized_user_email == self.user.email,
                                                           ancestor=global_key.key).fetch()]
                })
        else:
            return self.handle_json({
                "id": global_key.key.id(),
                "display_name": global_key.display_name
            })


class RunQueryHandler(BaseHandler):
    def options(self, query_id=None, t=None):
        self.response.headers[b'Access-Control-Allow-Origin'] = b'*'
        self.response.headers[b'Access-Control-Allow-Headers'] = b'Content-Type, Authorization'
        self.response.headers[b'Access-Control-Allow-Methods'] = b'POST, OPTIONS, PUT, DELETE'

    @user_required
    def post(self, query_id, t=None):
        # try:
        #     result_obj = self._run_query(query_id)
        # except ValueError as e:
        #     return self.handle_error(e)

        result_obj = self.run_query(query_id)

        if t == 'table':
            table_formatted_result = self._format_data_table(result_obj)
            return self.handle_json({
                'result': table_formatted_result
            })
        elif t == 'chart':
            try:
                _format = json.loads(self.request.body)
            except ValueError as e:
                return self.handle_error(e)

            plot_formatted_result = self._format_chart(_format['format'], result_obj)
            return self.handle_json({
                "result": plot_formatted_result
            })
        elif t == 'plot':
            try:
                _format = json.loads(self.request.body)
            except ValueError as e:
                return self.handle_error(e)

            formatted_result = self._format_plot(_format['format'], result_obj)
            return self.handle_json({
                "result": formatted_result
            })
        else:
            return self.handle_json({
                "result": result_obj
            })

    def module(self, module_name):
        try:
            return import_class(module_name)
        except Exception as e:
            self.handle_error_string('Wrong data source')

    def module_name(self, data_source_type):
        module_map = {
            "bigquery": "src.modules.bigquery.BigqueryModule",
            "cloudsql": "src.modules.cloudsql.CloudsqlModule"
        }
        name = module_map.get(data_source_type)
        if not name:
            self.handle_error_string("No module for this Data Source")

        return name

    def run_query(self, query_id):
        role = self.user.role
        if role not in ["owner", "admin", "view_admin"] \
                and query_id not in self.user.authorized_query_id:
            self.handle_error_string('You cannot access this query', 403)

        query_model = QueryModel.get_by_id(query_id)
        if not query_model:
            err_str = 'No query id: {}'.format(query_id)
            self.handle_error_string(err_str)

        params = self.request.GET.mixed()
        self.check_query_params(params)
        # self.check_query_table(query)

        cache_key = None

        if query_model.cache:
            cache_key = query_id + "?"
            for k in sorted(params):
                cache_key += '{0}={1}&'.format(k, params[k])
            result = memcache.get(cache_key)

            logging.info('cache key: {}'.format(cache_key))

            if result is not None:
                logging.info('Cached result')
                return json.loads(result)

        data_source_model = DataSourceModel.get_by_id(query_model.data_source_id)
        module_name = self.module_name(data_source_model.type)
        module = self.module(module_name)

        query_str = query_model.query_str
        query = Template(query_str).render(params)

        module_instance = module(data_source_model, query)

        result = None
        try:
            result = module_instance.execute_query()
        except Exception as e:
            self.handle_error(e)

        if query_model.cache:
            memcache.add(cache_key, to_json(result), time=1800)

        return result

    # def check_query_table(self, query):
    #     match = re.findall(r'from\s+`([A-Za-z_][A-Za-z_0-9\.\-]+)`', query, flags=re.IGNORECASE)
    #     return

    def check_query_params(self, params):
        for key, value in params.iteritems():
            global_key = GlobalKeyModel.get_by_id(key)
            if global_key and global_key.type == "PREDEFINED":
                global_value = GlobalValueModel.get_by_id(value, parent=global_key.key)
                if self.user.role not in ["owner", "admin", "view_admin"] \
                        and self.user.email not in global_value.authorized_user_email:
                    self.handle_error_string('Wrong key-value', 403)

            if not global_key:
                self.handle_error_string("Wrong key-value", 400)

    @staticmethod
    def _format_plot(f, result_obj):
        for trace in f:
            if trace['type'] == 'pie':
                trace['values'] = [row[1] for row in result_obj['rows']]
                trace['labels'] = [row[0] for row in result_obj['rows']]

            else:
                for item_k, item in trace.iteritems():
                    if item_k == 'x':
                        result_index = result_obj['schema'].index(item)
                        trace['x'] = [row[result_index] for row in result_obj['rows']]
                    elif item_k == 'y':
                        result_index = result_obj['schema'].index(trace['y'])
                        trace['y'] = [row[result_index] for row in result_obj['rows']]

        return f

    @staticmethod
    def _format_chart(f, result_obj):
        for k, v in f.iteritems():
            if k == 'datasets':
                if isinstance(v, list):
                    _list = []
                    for index, i in enumerate(v):
                        result_index = result_obj['schema'].index(i)
                        if f['type'] == 'line':
                            _list.append({
                                "data": [row[result_index] for row in result_obj['rows']],
                                "label": i,
                                "yAxisID": "y-axis-{0}".format(index + 1)
                            })
                        else:
                            _list.append({
                                "data": [row[result_index] for row in result_obj['rows']],
                                "label": i
                            })
                    f[k] = _list
            elif k == 'labels':
                result_index = result_obj['schema'].index(v)
                f[k] = [row[result_index] for row in result_obj['rows']]
        return f

    @staticmethod
    def _format_data_table(result_obj):
        _data = []
        for row in result_obj['rows']:
            _data_row = {}
            for index, item in enumerate(row):
                _data_row[result_obj['schema'][index]] = item
            _data.append(_data_row)
        return {
            "schema": result_obj['schema'],
            "data": _data,
            "count": result_obj['count']
        }
