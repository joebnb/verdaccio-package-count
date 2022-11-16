# verdaccio-download-count

> for npm analysis 

Features:
* server side for post record to elasticsearch
  * http://npmhost/-/analysis/_total for whole site count
  * http://npmhost/-/analysis/your_packge_name for request api
* client side for web page visualization download count like npm pakge
  * sparkline for weekly download trend
  * download count for years,months,weeks and days
  * tarball version count of last 7 days
* good caching and bulk esside scripting,lower affect in npm and elasticsearch service
---

## Prepare
**IMPORTANT:This plugin worked with elasticsearch,so elasticsearch service is required.(other wise es will throw error at init stage)**

## Install & setup
in your verdaccio:
```
npm i verdaccio-package-count
```

in your verdaccio config.yaml
```
middlewares:
  'verdaccio-package-count':
    enable: true
    sync_interval: 6000 # optional millisecond,post and index document frequence
    es_index: 'indexname' # optional
    elastic: 
      node: 'https://localhost:9200'
      auth: 
        # note: the authentication one of the two is enough
        username: elastic
        password: your_password
        apiKey: your_api_key   
      tls: 
        rejectUnauthorized: false // if you don't have ssl certificate
```

## Other
if want remove data delete this index `_npm_analysis_package_count` in your elastic search.


