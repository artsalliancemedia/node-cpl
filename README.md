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