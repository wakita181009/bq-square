import json
import os
from .plugins.base_handler import BaseHandler
from .plugins.user import verify_google_token

OWNER = os.environ['OWNER']


class AuthHandler(BaseHandler):
    def post(self):
        try:
            json_data = json.loads(self.request.body)
        except ValueError as e:
            return self.handle_error(e)

        google_token = json_data.get('google_token')

        try:
            u = self.user_model.get_by_google_token(google_token)
            if not u:
                if self.user_model.query().count() == 0:
                    return self.handle_error_string("NeedSetupError", 403)

                return self.handle_error_string('Invalid Auth ID', 403)

            if not u.verified:
                ok, idinfo = verify_google_token(google_token)
                if ok:
                    user_data = {
                        'google_id': idinfo['sub'],
                        'google_image_url': idinfo['picture'],
                        'email': idinfo['email'],
                        'google_given_name': idinfo['given_name'],
                        'google_family_name': idinfo['family_name'],
                        'google_name': idinfo['name'],
                        'role': 'owner'
                    }

                    try:
                        for k, v in user_data.items():
                            setattr(u, k, v)
                        u.verified = True
                        u_key = u.put()
                        u = u_key.get()
                    except Exception as e:
                        return self.handle_error(e)

            user_dict = self.user_model.model_to_dict(u)
            del user_dict['created']
            del user_dict['updated']
            del user_dict['deleted']

            jwt_token = self.encode_jwt_token(user_dict)

            return self.handle_json({
                "token": jwt_token
            })

        except Exception as e:
            self.handle_error(e, 403)
