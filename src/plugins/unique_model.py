# -*- coding: utf-8 -*-
from google.appengine.ext.ndb import model


class UniqueModelError(Exception):
    """This is for unique model"""


class Unique(model.Model):
    """A model to store unique values.

    The only purpose of this model is to "reserve" values that must be unique
    within a given scope, as a workaround because datastore doesn't support
    the concept of uniqueness for entity properties.

    For example, suppose we have a model `User` with three properties that
    must be unique across a given group: `username`, `auth_id` and `email`::

        class User(model.Model):
            username = model.StringProperty(required=True)
            auth_id = model.StringProperty(required=True)
            email = model.StringProperty(required=True)

    To ensure property uniqueness when creating a new `User`, we first create
    `Unique` records for those properties, and if everything goes well we can
    save the new `User` record::

        @classmethod
        def create_user(cls, username, auth_id, email):
            # Assemble the unique values for a given class and attribute scope.
            uniques = [
                'User.username.%s' % username,
                'User.auth_id.%s' % auth_id,
                'User.email.%s' % email,
            ]

            # Create the unique username, auth_id and email.
            success, existing = Unique.create_multi(uniques)

            if success:
                # The unique values were created, so we can save the user.
                user = User(username=username, auth_id=auth_id, email=email)
                user.put()
                return user
            else:
                # At least one of the values is not unique.
                # Make a list of the property names that failed.
                props = [name.split('.', 2)[1] for name in uniques]
                raise ValueError('Properties %r are not unique.' % props)

    Based on the idea from http://goo.gl/pBQhB
    """

    @classmethod
    def create(cls, value):
        """Creates a new unique value.

        :param value:
            The value to be unique, as a string.

            The value should include the scope in which the value must be
            unique (ancestor, namespace, kind and/or property name).

            For example, for a unique property `email` from kind `User`, the
            value can be `User.email:me@myself.com`. In this case `User.email`
            is the scope, and `me@myself.com` is the value to be unique.
        :returns:
            True if the unique value was created, False otherwise.
        """
        entity = cls(key=model.Key(cls, value))
        txn = lambda: entity.put() if not entity.key.get() else None
        return model.transaction(txn) is not None

    @classmethod
    def create_multi(cls, values):
        """Creates multiple unique values at once.

        :param values:
            A sequence of values to be unique. See :meth:`create`.
        :returns:
            A tuple (bool, list_of_keys). If all values were created, bool is
            True and list_of_keys is empty. If one or more values weren't
            created, bool is False and the list contains all the values that
            already existed in datastore during the creation attempt.
        """
        # Maybe do a preliminary check, before going for transactions?
        # entities = model.get_multi(keys)
        # existing = [entity.key.id() for entity in entities if entity]
        # if existing:
        #    return False, existing

        # Create all records transactionally.
        keys = [model.Key(cls, value) for value in values]
        entities = [cls(key=key) for key in keys]
        func = lambda e: e.put() if not e.key.get() else None
        # created = [model.transaction(lambda: func(e)) for e in entities]
        created = [func(e) for e in entities]

        if created != keys:
            # A poor man's "rollback": delete all recently created records.
            model.delete_multi(k for k in created if k)
            return False, [k.id() for k in keys if k not in created]

        return True, []

    @classmethod
    def delete_multi(cls, values):
        """Deletes multiple unique values at once.

        :param values:
            A sequence of values to be deleted.
        """
        return model.delete_multi(model.Key(cls, v) for v in values)
