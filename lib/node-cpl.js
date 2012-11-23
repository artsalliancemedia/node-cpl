/**
 * Command line node-dcp application
 */
var fs = require('fs'),
	cplParser = require('./parse_cpl');

if (require.main === module) {

	if (process.argv.length !== 3) {
		console.log("Usage: node node-cpl.js <CPL XML file>");
	} 
    else {
        var cplStream = cplParser.createStream();
        fs.createReadStream(process.argv[2]).pipe(cplStream);

     	cplStream.on('cpl', function(cpl) {
            console.log(JSON.stringify(cpl));
     	});
    }
}