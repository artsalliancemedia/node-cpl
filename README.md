[![Build Status](https://travis-ci.org/artsalliancemedia/node-cpl.png)](http://travis-ci.org/artsalliancemedia/node-cpl)

** The NPM package has been renamed from node-cpl to cpl! Make sure to update your dependencies. **

CPL Parsing
===========

A CPL parsing library for Node.js

Usage
-----

Using streams:

```javascript
var cplParser = require('node-cpl');
var fs = require('fs');

var cplStream = cplParser.createStream();
fs.createReadStream('cpl.xml').pipe(cplStream);
cplStream.on('cpl', function(cpl) {
  console.log(cpl);
});
```

Using callbacks:

```javascript
cplParser.parseCPL(fs.readFileSync('cpl.xml', 'UTF-8'), function(err, cpl) {
    if (err) return console.error(err);
    console.log(cpl);
});
```

The CPL object takes the form:

```json
{
	"id": "7b1e5649-ff30-489b-b74a-c2e1060bb590",
	"text": "AIDA-ACT1_FTR_F_IT-DE_DE_51_2K_20090217_AAM",
	"issueDate": "2009-02-04T10:34:09.000Z",
	"issuer": "Arts Alliance Media",
	"creator": "wl-cpl + Wailua v0.4.27",
	"titleText": "AIDA-ACT1_FTR_F_IT-DE_DE_51_2K_20090217_AAM",
	"type": "feature",
	"duration": 2668,
	"frames": 64032,
	"reels": [
		{
			"id":"a6c93bfa-7f30-4882-9fd3-8d145b504e6c",
			"editRate":[24,1],"frames":312,
			"aspectRatio":1.85
		},
		{
			"id":"c0fc84ce-2b78-43cf-bec7-309fdb64dd0c",
			"editRate":[24,1],"frames":63720,
			"aspectRatio":1.85
		}
	]
}
```

License (MIT)
-------------

Copyright 2012 Arts Alliance Media

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
