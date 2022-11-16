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
* good caching and bulk ES side scripting,lower affect in npm and elasticsearch service
---

## Prepare
**IMPORTANT:This plugin worked with elasticsearch,so elasticsearch service is required.(other wise es client will throw error at init stage)**
tested on verdaccio 5.x,if some error occored you should remove es index and restart service again(in old version,es mapping is incorrect,delete and restart will create a correct index)

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
    elastic:  # this property would refrence elasti official document
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


