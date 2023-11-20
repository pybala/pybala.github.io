---
title: "Python - connecting to BigQuery"
date: "2017-10-24"
canonical: "https://balakumar.net.in/python-connecting-to-bigquery/"
categories: 
  - "data-engineering"
tags: 
  - "bigquery"
  - "python"
---

Please refer the below article for installing Bigquery and its dependencies.

http://www.balakumarp.net/2017/10/24/python-bigquery-installation-and-requirements/

Now lets create a base script or service for connecting to BigQuery. Create a new file called bigquery_connect.py under your project lib/helpers dir.

**Example:** /project/libs/bigquery/bigquery_connect.py

```python
from google.cloud import bigquery
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from app.config import config

PROJECT_NAME = config.get('bigquery', 'project_name')
CREDENTIALS_FILEPATH = config.get('bigquery', 'server_secret_file')

class BigqueryConnect(object):

    _credentials = None
    _service = None

    def getClientService(self):
        if self._service is not None:
            pass

        self._service = bigquery.Client(project=PROJECT_NAME, credentials=self.__generate_credential())

        return self._service

    def __generate_credential(self):
        if self._credentials is not None:
            pass

        self.__credentials = service_account.Credentials.from_service_account_file(CREDENTIALS_FILEPATH)

        return self.__credentials
```

Use this as a base class connector to all of your other scripts that needs bigquery client.
