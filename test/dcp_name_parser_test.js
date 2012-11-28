/**
 * Tests the CPL parser
 */

var assert = require('assert'),
	parse = require('../lib/dcp_name_parser').parse;

/**
 * CPL parser tests
 */
describe('dcpNameParser', function() {

	var dcpName = 'NAME-OF-MOVIE_FTR-2_F_EN-XX_US-GB_51-EN_2K_ST_20070115_FAC_i3D_OV';

	describe('parse', function() {
		it('should parse a DCP name', function(done) {
			var dcp = parse(dcpName);
			assert(dcp);
			assert.equal(dcp.name, 'NAME-OF-MOVIE');
			assert.equal(dcp.type, 'feature');
			assert.equal(dcp.aspectRatio, 'flat');
			assert.equal(dcp.language, 'EN');
			assert(!dcp.subtitles);
			assert.equal(dcp.territory, 'US');
			assert.equal(dcp.rating, 'GB');
			assert.equal(dcp.audio, '51');
			assert.equal(dcp.audioLanguage, 'EN');
			assert.equal(dcp.resolution, '2K');
			assert.equal(dcp.studio, 'ST');
			assert.equal(dcp.date.getTime(), new Date('2007', '01', '15').getTime());
			assert.equal(dcp.facility, 'FAC');
			assert(dcp.threeD);
			assert(!dcp.ghostbusted);
			assert.equal(dcp.version, 'OV');
			done();
		});
	});

});