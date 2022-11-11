# verdaccio-download-count

> for npm analysis

---

## prepare
**this plugin worked with elasticsearch,so elasticsearch service is required.**

## install & setup
in your verdaccio:
```
npm i verdaccio-package-count
```

in your verdaccio config.yaml
```
middlewares:
  'verdaccio-package-count':
    enable: true
    sync_interval: 6000 # optional
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

## other
if want remove data delete this index `npm_analysis_packages` in your elastic search.


