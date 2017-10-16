# -*- coding: utf-8 -*-
import os
import logging

import jwt
from jwt.contrib.algorithms.pycrypto import RSAAlgorithm
from jwt.contrib.algorithms.py_ecdsa import ECAlgorithm

jwt.register_algorithm('RS256', RSAAlgorithm(RSAAlgorithm.SHA256))
jwt.register_algorithm('ES256', ECAlgorithm(ECAlgorithm.SHA256))

rsa_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "rsa")

with open(os.path.join(rsa_path, "public.pem"), "rb") as f:
    PUBLIC_PEM = f.read()


class JWTAuthError(Exception):
    """JWT Auth Error"""


# with open(os.path.join(rsa_path, "private.pem"), "rb") as f:
#     PRIVATE_PEM = f.read()


class JwtToken(object):
    def __init__(self, public_pem=PUBLIC_PEM, private_pem=''):
        # toDo use webapp2 config
        self.public_pem = public_pem
        # self.private_pem = private_pem

    def decode_jwt_token(self, token):
        try:
            return jwt.decode(token, self.public_pem, algorithm='RS256')
        except Exception as e:
            logging.exception("Wrong JWT token: {0}".format(e))
            raise JWTAuthError("Wrong JWT token")

            # def encode_jwt_token(self, obj):
            #
            #     try:
            #         token = jwt.encode(obj, self.private_pem, algorithm='RS256')
            #         return True, token
            #     except Exception as e:
            #         logging.info(e)
            #
            #     return False, None
