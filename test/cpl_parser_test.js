/**
 * Tests the CPL parser
 */

var assert = require('assert'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	cplParser = require('../index.js');

/**
 * Returns a list of CPL files
 */
var getCPLFiles = function() {
    var cplFiles = [];
    var cplDir = path.resolve(__dirname, path.join('cpls'));
    var files = fs.readdirSync(cplDir);
    files.forEach(function(file) {
        file = path.resolve(cplDir, file);
        if (fs.statSync(file).isFile() && file.indexOf('.xml') != -1)
            cplFiles.push(file);
    });
    return cplFiles;
};

/**
 * CPL parser tests
 */
describe('cplParser', function() {

	describe('createStream', function() {
		it('should create a stream and parse the metadata from an XML stream', function(done) {
			var cplStream = cplParser.createStream();
 			fs.createReadStream(path.resolve(__dirname, path.join('cpls', 'cpl.xml'))).pipe(cplStream);

 			cplStream.on('cpl', function(cpl) {
				assert(cpl, 'CPL metadata should not be null');
				assert.equal(cpl.id, '7b1e5649-ff30-489b-b74a-c2e1060bb590', 'CPL id is incorrect');
				assert.equal(cpl.issuer, 'Arts Alliance Media', 'CPL issuer is incorrect');
				done();
 			});
		});
	});

	describe('parse', function() {
		it('should parse and callback the metadata from an XML string', function(done) {
			// Load the test CPL
			fs.readFile(path.resolve(__dirname, path.join('cpls', 'cpl.xml')), 'utf8', function(err, xml) {
				cplParser.parse(xml, function(err, cpl) {
					assert.ifError(err);
					assert(cpl, 'CPL metadata should not be null');
					assert.equal(cpl.id, '7b1e5649-ff30-489b-b74a-c2e1060bb590', 'CPL id is incorrect');
					assert.equal(cpl.issuer, 'Arts Alliance Media', 'CPL issuer is incorrect');
					done();
				});
			});
		});
	});

	describe('createStreamMulti', function() {
		it('should create a stream and parse the metadata from a series of XML streams', function(done) {
			async.forEach(getCPLFiles(),
				function(cplFile, cb) {
					var cplStream = cplParser.createStream();
		 			fs.createReadStream(cplFile).pipe(cplStream);

		 			cplStream.on('cpl', function(cpl) {
						assert(cpl, 'CPL metadata should not be null');
						assert(cpl.id, 'CPL id should not be null');
						cb();
		 			});
				},
				function(err) {
					if (err) assert.fail(err);
					done()
				});
		});
	});

});
