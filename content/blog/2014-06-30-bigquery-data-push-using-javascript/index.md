---
title: "BigQuery data push using Javascript"
date: "2014-06-30"
canonical: "https://balakumar.net.in/bigquery-data-push-using-javascript/"
categories: 
  - "bigquery-2"
tags: 
  - "bigquery"
  - "javascript"
---

```js
 var googObj = googObj || {};

(function($) {
  googObj.bigQuery = {

      projectNumber: '<Project Number>',
      clientId: '<Client ID>',
      projectId: '<Project ID>',
      datasetId: '<DataSet ID>',
      tableId: '<Table ID>',

      initAuth: function() {
          var config = {
            'client_id': googObj.bigQuery.clientId,
            'scope': 'https://www.googleapis.com/auth/bigquery'
          };

          gapi.auth.authorize(config, function() {
              gapi.client.load('bigquery', 'v2');
          });
      },
      
      insertData: function() {
          var request = gapi.client.bigquery.tabledata.insertAll({
            'projectId': googObj.bigQuery.projectId,
            'datasetId': googObj.bigQuery.datasetId,
            'tableId': googObj.bigQuery.tableId,
            "kind": "bigquery#tableDataInsertAllRequest",
            "rows":[
                {
                    //"insertId": Math.random().toString(36).slice(2),
                    "insertId": (new Date()).getTime().toString(),
                    "json": {
                        "field_1": "value for field_1",
                        "field_2": "value for field_2",
                        "field_3": "value for field_3"
                    }
                }
            ]
          });

          request.execute(function(response) {
              //$('#result_box').html(JSON.stringify(response.result.rows, null));
          });
      },
      
      init: function() {
          setTimeout( function() {
                googObj.bigQuery.initAuth();
          }, 500);
      }
  }
})(jQuery);

jQuery(document).ready(function($) {
    googObj.bigQuery.init();
});
```

Replace respective BigQuery related variables with your Project ID and Client Id.. etc

Once the authentication is triggered, you can use **googObj.bigQuery.insertData()** to push the data in to BigQuery tables.
