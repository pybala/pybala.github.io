---
title: "Python - BigQuery utility script"
date: "2017-10-24"
categories: 
  - "data-engineering"
tags: 
  - "bigquery"
  - "python"
---

Get the bigquery connector util from below article.

https://balakumar.net.in/python-connecting-to-bigquery/

Now lets create a new bigquery client utility script (**bigquery_client.py**) by using the connect service **bigquery_connect.py** base class.

This utility script is for 

- Listing all the datasets
- Creating new dataset
- Checking the existence of a dataset
- Creating new table and checking for existence
- Getting the table data
- Creating new view and checking for existence

```python
import re
from googleapiclient.errors import HttpError
from app.config import config
from app.libs.bq.bigquery_connect import BigqueryConnect

class BigqueryClient(BigqueryConnect):

    _service = None

    def __init__(self):
        self._service = self.getClientService()
        self._response = {
            'status': None,
            'data': {}
        }

    def getDatasets(self):
        """
        List of all datasets
        :returns: dict
        """
        ds = []

        for dataset in self._service.list_datasets():  # API request(s)
            if re.match('^z_.+', dataset.name) is not None:

                #dsInfo = self._service.dataset( dataset.name ).execute()
                #dsInfo = bigquery.dataset.Dataset( dataset.name, self._service)
                #dsInfo.friendly_name

                ds.append( {
                    'name': dataset.name,
                    'friendly_name': dataset.friendly_name,
                    'description': dataset.description
                } )

        return ds

    def isDatasetExists(self, datasetName):
        """
        Check whether Dataset exist or not
        :param datasetName: Name of the Dataset
        :returns: Boolean
        """
        dataset = self._service.dataset(datasetName)

        if dataset.exists():
            return True

        return False

    def createDataset(self, name, friendlyName, description=None):
        """
        Creating new Dataset
        :param name: Name of the Dataset
        :param friendlyName: Display name of the Dataset
        :param description: (Optional) Description about the Dataset
        :returns: Object with response details
        """

        try:
            dataset = self._service.dataset(name)

            if not dataset.exists():
                dataset.friendly_name = friendlyName

                if description is not None:
                    dataset.description = description

                dataset.create()

                self._response['status'] = 'success'
                self._response['data'] = {
                    'message': 'Dataset created successfully',
                    'bqObject': dataset
                }
            else:
                self._response = self._responseExists()

        except HttpError, err:
            self._response = self._responseError(err._get_reason())

        return self._response

    def getView(self, datasetName, viewName):
        """
        Check whether View exist or not
        :param datasetName: Name of the Dataset
        :param viewName: Name of the View
        :returns: Boolean
        """
        dataset = self._service.dataset(datasetName)
        view = dataset.table(viewName)

        if view.exists():
            view.reload()
            return view

        return False

    def createView(self, datasetName, viewName, viewSql, displayName=None, description=None):
        """
        Creating new View under a dataset
        :param datasetName: Dataset object
        :param viewName: Name of the View
        :param viewSql: SQL view query
        :param displayName: (Optional) Friendly name of the View
        :param description: (Optional) Description about the View
        :returns: Object with response details
        """

        dataset = self._service.dataset(datasetName)
        table = dataset.table(viewName)

        try:
            table.type = 'VIEW'
            table.view_query = viewSql

            if not table.exists():
                if displayName is not None:
                    table.friendlyName = displayName

                if description is not None:
                    table.description = description

                table.create()

                self._response['data'] = {
                    'message': 'created',
                    'bqObject': table
                }
            else:
                table.update()

                self._response['data'] = {
                    'message': 'updated',
                    'bqObject': table
                }

            self._response['status'] = 'success'
        except HttpError, err:
            self._response = self._responseError(err._get_reason())

        return self._response

    def createTable(self, datasetName, tableName, schema):
        """
        Creating new View under a dataset
        :param datasetName: Dataset object
        :param tableName: Name of the Table
        :param schema: Table schema
        :returns: Object with response details
        """

        dataset = self._service.dataset(datasetName)
        table = dataset.table(tableName)

        try:
            table.schema = schema

            if not table.exists():
                table.create()

                self._response['data'] = {
                    'message': 'created',
                    'bqObject': table
                }
            else:
                table.update()

                self._response['data'] = {
                    'message': 'updated',
                    'bqObject': table
                }

            self._response['status'] = 'success'
        except HttpError, err:
            self._response = self._responseError(err._get_reason())

        return self._response

    def getTableData(self, datasetName, tableName, maxResults=None):
        """
        Check whether View exist or not
        :param datasetName: Name of the Dataset
        :param tableName: Name of the Table
        :param maxResults: Return rows limit
        :returns: List
        """
        dataset = self._service.dataset(datasetName)
        table = dataset.table(tableName)

        if table.exists():
            table.reload()
            if maxResults is not None:
                tableData = table.fetch_data(max_results=maxResults)
            else:
                tableData = table.fetch_data()

            dataList = [list(i) for i in tableData]

            return {
                'fields': [field.name for field in table.schema],
                'data': dataList
            }

        return {}

    def _responseExists(self):
        return {
            'status': 'error',
            'data': {
                'message': 'exists'
            }
        }

    def _responseError(self, error):
        return {
            'status': 'error',
            'data': {
                'message': error
            }
        }
```
