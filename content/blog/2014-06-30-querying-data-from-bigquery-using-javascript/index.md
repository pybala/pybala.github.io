---
title: "Querying data from BigQuery using client side Javascript"
date: "2014-06-30"
canonical: "https://balakumar.net.in/querying-data-from-bigquery-using-javascript/"
categories: 
  - "WEB"
  - "Data Engineering"
tags: 
  - "BigQuery"
  - "Javascript"
---

Add the following libraries

```html
<script src="https://apis.google.com/js/client.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
```

Use the following script to pull the data from BigQuery

```js
var googObj = googObj || {};

(function($) {
  googObj.bigQuery = {

      projectNumber: '<Project Number from your API console>',
      clientId: '<Client ID from your API console>',

      initAuth: function() {
          var config = {
            'client_id': googObj.bigQuery.clientId,
            'scope': 'https://www.googleapis.com/auth/bigquery'
          };

          gapi.auth.authorize(config, function() {
              gapi.client.load('bigquery', 'v2');
          });
      },
      
      getData: function() {
          var request = gapi.client.bigquery.jobs.query({
              'projectId': googObj.bigQuery.projectNumber,
              'timeoutMs': '30000',
              'query': 'SELECT * FROM [publicdata:samples.github_timeline] LIMIT 10;'
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

Call the function **googObj.bigQuery.getData()** to get the data.
