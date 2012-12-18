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
 * Blanket asserts for the first test CPL
 */
var cpl1Asserts = function(cpl) {
	assert(cpl);
	assert.equal(cpl.id, '7b1e5649-ff30-489b-b74a-c2e1060bb590');
	assert.equal(cpl.issuer, 'Arts Alliance Media');
	assert.equal(cpl.issueDate.getTime(), new Date('2009-02-04T10:34:09-00:00').getTime());
	assert.equal(cpl.creator, 'wl-cpl + Wailua v0.4.27');
	assert.equal(cpl.titleText, 'AIDA-ACT1_FTR_F_IT-DE_DE_51_2K_20090217_AAM');
	assert.equal(cpl.text, 'AIDA-ACT1_FTR_F_IT-DE_DE_51_2K_20090217_AAM');
	assert.equal(cpl.type, 'feature');
	assert(cpl.hasSubtitles);
	assert(!cpl.threeD);
	assert(cpl.reels);
	assert(cpl.reels.length, 2);
	assert.equal(cpl.reels[0].id, '20afa00e-1923-4ceb-8ecc-868db492e53d');
	assert.equal(cpl.reels[0].editRate[0], 24);
	assert.equal(cpl.reels[0].frames, 312);
	assert.equal(cpl.reels[0].aspectRatio, 1.85);
	assert.equal(cpl.reels[1].id, '553bb212-d758-4ef8-9789-cc2ca1104116');
	assert.equal(cpl.reels[1].editRate[0], 24);
	assert.equal(cpl.reels[1].frames, 63720);
	assert.equal(cpl.reels[1].aspectRatio, 1.85);
};

/**
 * Blanket asserts for the annotation text of the first CPL
 */
 var cpl1TextAsserts = function(cpl) {
 	assert(cpl);
 	assert.equal(cpl.name, 'AIDA-ACT1');
 	assert.equal(cpl.type, 'feature');
 	assert.equal(cpl.aspectRatio, 'flat');
 	assert.equal(cpl.language, 'IT');
 	assert.equal(cpl.subtitles, 'DE');
 	assert.equal(cpl.territory, 'DE');
 	assert(!cpl.rating);
 	assert.equal(cpl.audio, '51');
 	assert.equal(cpl.resolution, '2K');
 	assert.equal(cpl.studio, 'AAM');
 	assert.deepEqual(cpl.date, new Date(2009, 02, 17));
 };

/**
 * Blanket asserts for the second test CPL
 */
var cpl2Asserts = function(cpl) {
	assert(cpl);
	assert.equal(cpl.id, '3a4a95d1-6947-4752-8c73-57fc80111973');
	assert.equal(cpl.issuer, 'Qube');
	assert.equal(cpl.issueDate.getTime(), new Date('2010-03-26T10:35:49+00:00').getTime());
	assert.equal(cpl.creator, 'QubeMaster Pro 2.3.1.0');
	assert.equal(cpl.titleText, '014_SD3D_ENC_S_FTR_F_EN-XX_UK_51_48_ST_20100326_FAC_i3D-ngb_OV');
	assert.equal(cpl.text, '014_SD3D_ENC_SYNFIXED_J2K');
	assert.equal(cpl.type, 'feature');
};

/**
 * CPL parser tests
 */
describe('cplParser', function() {

	describe('createStream#1', function() {
		it('should create a stream and parse the metadata from an XML stream', function(done) {
			var cplStream = cplParser.createStream();
 			fs.createReadStream(path.resolve(__dirname, path.join('cpls', 'cpl.xml'))).pipe(cplStream);
 			cplStream.on('cpl', function(cpl) {
				cpl1Asserts(cpl);
				done();
 			});
		});
	});

	describe('createStream#2', function() {
		it('should create a stream and parse the metadata from an XML stream', function(done) {
			var cplStream = cplParser.createStream();
 			fs.createReadStream(path.resolve(__dirname, path.join('cpls', 'cpl2.xml'))).pipe(cplStream);
 			cplStream.on('cpl', function(cpl) {
				cpl2Asserts(cpl);
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
					cpl1Asserts(cpl);
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

	describe('createStream#1WithDCNameOption', function() {
		it('should create a stream and parse the metadata from an XML stream and parse the DC name', function(done) {
			var cplStream = cplParser.createStream({parseDCName: true});
 			fs.createReadStream(path.resolve(__dirname, path.join('cpls', 'cpl.xml'))).pipe(cplStream);
 			cplStream.on('cpl', function(cpl) {
				cpl1Asserts(cpl);
				cpl1TextAsserts(cpl);
				done();
 			});
		});
	});


});
