# -*- coding: utf-8 -*-
import webapp2
import time


class BigqueryModule(object):
    def __init__(self, data_source_model, query):
        app = webapp2.get_app()
        bigquery_client = app.registry.get('bigquery_client')
        if not bigquery_client:
            from google.cloud import bigquery
            bigquery_client = bigquery.Client()
            app.registry['bigquery_client'] = bigquery_client

        self.bigquery_client = bigquery_client

        self.data_source_model = data_source_model
        self.query = query

    def execute_query(self):
        query = self.bigquery_client.run_sync_query(self.query)
        query.use_legacy_sql = False
        query.use_query_cache = True
        query.timeout_ms = 120
        query.run()
        page_token = None

        job = query.job
        job.reload()
        retry_count = 0

        while retry_count < 5 and job.state != u'DONE':
            time.sleep(1)
            job.reload()

        while True:
            rows, total_rows, page_token = query.fetch_data(
                max_results=1000,
                page_token=page_token)
            result_obj = {
                "schema": [s.name for s in query.schema],
                "rows": [list(row) for row in rows],
                "count": len(rows)
            }

            if not page_token:
                break

        return result_obj
