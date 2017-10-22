import json
from datetime import datetime, date
import pytz


def support_datetime_default(o):
    if isinstance(o, datetime):
        o = pytz.utc.localize(o).astimezone(pytz.timezone('Asia/Tokyo'))
        return o.strftime("%Y/%m/%d(%A) %H:%M:%S")
    if isinstance(o, date):
        return o.strftime("%Y/%m/%d")
    raise TypeError(repr(o) + " is not JSON serializable")


def to_json(obj):
    return json.dumps(obj, default=support_datetime_default)