import os
import MySQLdb


class CloudsqlModule(object):
    def __init__(self, data_source_model, query):
        self.data_source_model = data_source_model
        self.query = query

    def connect_to_cloudsql(self):
        cloudsql_connection_name = self.data_source_model.cloudsql_connection_name
        cloudsql_user = self.data_source_model.cloudsql_user
        cloudsql_password = self.data_source_model.cloudsql_password
        cloudsql_db = self.data_source_model.cloudsql_db

        # When deployed to App Engine, the `SERVER_SOFTWARE` environment variable
        # will be set to 'Google App Engine/version'.
        if os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/'):
            # Connect using the unix socket located at
            # /cloudsql/cloudsql-connection-name.
            cloudsql_unix_socket = os.path.join(
                '/cloudsql', cloudsql_connection_name)

            db = MySQLdb.connect(
                unix_socket=cloudsql_unix_socket,
                user=cloudsql_user,
                passwd=cloudsql_password,
                db=cloudsql_db)

        # If the unix socket is unavailable, then try to connect using TCP. This
        # will work if you're running a local MySQL server or using the Cloud SQL
        # proxy, for example:
        #
        #   $ cloud_sql_proxy -instances=your-connection-name=tcp:3306
        #
        else:
            db = MySQLdb.connect(
                host='127.0.0.1', user=cloudsql_user, passwd=cloudsql_password, db=cloudsql_db)

        return db

    def execute_query(self):
        db = self.connect_to_cloudsql()
        cursor = db.cursor()
        cursor.execute(self.query)

        schema = [column[0] for column in cursor.description]
        query_result = cursor.fetchall()

        return {
            "schema": schema,
            "rows": query_result,
            "count": len(query_result)
        }
