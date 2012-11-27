/**
 * Tests the CPL parser
 */

var assert = require('assert'),
	parse = require('../lib/dcp_name_parser').parse;

/**
 * CPL parser tests
 */
describe('dcpNameParser', function() {

	var dcpName = 'NAME-OF-MOVIE_FTR-2_F_EN-XX_US-GB_51-EN_2K_ST_20070115_FAC_i3D-OV';

	describe('parse', function() {
		it('should parse a DCP name', function(done) {
			var dcp = parse(dcpName);
			assert(dcp);
			assert.equal(dcp.name, 'NAME-OF-MOVIE', 'Name of the feature is incorrect');
			assert.equal(dcp.type, 'feature', 'Content type is wrong');
			assert.equal(dcp.aspectRatio, 'flat', 'Aspect ratio is wrong');
			assert.equal(dcp.language, 'EN', 'Wrong language');
			assert(!dcp.subtitles, 'DCP has no subtitles');
			done();
		});
	});

});