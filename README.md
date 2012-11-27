CPL Parsing
===========

A CPL parsing library for Node.js

Usage
-----

```javascript
var cplParser = require('node-cpl');
var fs = require('fs');

var cplStream = cplParser.createStream();
fs.createReadStream('cpl.xml').pipe(cplStream);
cplStream.on('cpl', function(cpl) {
  console.log(cpl);
});
```

The CPL object takes the form:

```json
{"reels":[{"id":"a6c93bfa-7f30-4882-9fd3-8d145b504e6c","editRate":["24","1"],"frames":312,"aspectRatio":1.85},{"id":"c0fc84ce-2b78-43cf-bec7-309fdb64dd0c","editRate":["24","1"],"frames":63720,"aspectRatio":1.85}],"id":"7b1e5649-ff30-489b-b74a-c2e1060bb590","text":"AIDA-ACT1_FTR_F_IT-DE_DE_51_2K_20090217_AAM","issueDate":"2009-02-04T10:34:09.000Z","issuer":"Arts Alliance Media","creator":"wl-cpl + Wailua v0.4.27","titleText":"AIDA-ACT1_FTR_F_IT-DE_DE_51_2K_20090217_AAM","type":"feature"}
```