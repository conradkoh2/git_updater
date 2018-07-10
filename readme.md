Edit repos.json with the paths to the repository that you wish to control
The key is the unique identifier for your repository, and the path and url correspond to physical path and remote origin respectively.
```
"webroot": {
        "path": "/Users/Conrad/Documents/Projects/pencil/portal/htlms/mha_htlms_portal",
        "url": "https://conrad.koh@git1.mqhq.mqspectrum.com:8445/scm/~conrad.koh/mha_htlms_portal.git"
    }
```
Run the following command to get the server started
```node server.js```
