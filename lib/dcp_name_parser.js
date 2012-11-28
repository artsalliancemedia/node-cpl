/**
 * Parser to try and dismantle the de facto DCP naming convention
 * http://digitalcinemanamingconvention.com/
 */

/**
 * Content types
 */
var contentTypes = {FTR: 'feature', TLR: 'trailer', TRG: 'rating', TSR: 'teaser', POL: 'policy',
	PSA: 'service', ADV: 'advertisement', SHR: 'short', XSN: 'transitional', TST: 'test'};

/**
 * Aspect ratios
 */
var aspectRatios = {F: 'flat', S: 'scope', C: 'container'};

/**
 * Regex selection for language
 */
 var langSelectRegex = 'SQ|AR|BS|BG|CA|YUE|CMN|QMS|QMT|NAN|QTM|HR|CS|DA|NL|EN|ET|EUS|FI|VLS|FR|QFC|DE|' +
					   'GSW|EL|HE|HI|HU|IS|IND|IT|JA|KO|LV|LT|MSA|NO|PL|QBP|PT|RO|RU|SR|SK|SL|QSA|ES|LAS|QSM|' +
					   'SV|TA|TE|TH|TR|UK|VI';

/**
 * Regex selection for territory
 */
 var territorySelectRegex = 'AE|AL|AR|AT|AU|BA|BE|BG|BH|BO|BR|BY|CA|CH|CL|CN|CO|CS|CY|CZ|DE|DK|DU|EC|EE|EG|ES|FI|' +
                            'FR|GR|GT|HK|HR|HU|ID|IE|IL|IN|IS|IT|JO|JP|KE|KR|KW|KZ|LB|LT|LU|LV|MD|ME|MX|MY|NG|NL|' +
                            'NO|NZ|OM|PA|PE|PH|PK|PL|PT|PY|QA|RO|RU|SA|SE|SG|SI|SK|SY|TH|TR|TT|TW|UA|UK|US|UY|VE|VN|ZA';

/**
 * The regular expressions for the different bits of data in a DCP name
 */
var contentTypeRegex = /^(FTR|TLR|TRG|TSR|POL|PSA|ADV|SHR|XSN|TST)*/,
	aspectRatioRegex = /^(F|S|C)$/,
    languageRegex = new RegExp('^(' + langSelectRegex + ')-(' + langSelectRegex + '|XX)$'),
    territoryRegex = new RegExp('^(' + territorySelectRegex + ')-((?:[A-Z]|[0-9])*)$'),
    audioRegex = new RegExp('^([0-9]{2})-(' + langSelectRegex + ')$'),
    resolutionRegex = /^(2K|4K|48)$/,
    studioRegex = /^([A-Z]{2,4})$/,
    facilityRegex = /^([A-Z]{3})$/,
    dateRegex = /^([0-9]{4})([0-9]{2})([0-9]{2})$/,
    dimensionRegex = /^i3D(?:-)?(gb|ngb)?$/,
    versionRegex = /^(OV|VF)(?:-[0-9])?$/;

/**
 * Parse a DCP name
 *
 * Works as follows:
 *
 * Assumes that the first token is always going to be the DCP name
 * Makes no assumption about the order of the rest of the tokens
 * Makes no assumption about the presence of tokens other than name
 */
exports.parse = function(dcpName) {
	var dcp = {};
	var matched = {}; // Tracks which items have been matched

	// Split into tokens
	var tokens = dcpName.split('_');
	if (tokens.length === 0)
		return dcp;
	// Get the content title
	dcp.name = tokens[0];

	// Cycle through the remaining tokens and attempt
	// to apply the regex checks for each token type
	tokens.splice(1).forEach(function(token) {

		// Content type
		var match = contentTypeRegex.exec(token);
		if (match && contentTypes[match[1]]) {
			dcp.type = contentTypes[match[1]];
			return;
		}

		// Projector aspect ratio
		match = aspectRatioRegex.exec(token);
		if (match && aspectRatios[match[1]]) {
			dcp.aspectRatio = aspectRatios[match[1]];
			return;
		}

		// Language audio and subtitles
		match = languageRegex.exec(token);
		if (match && match.length === 3) {
			dcp.language = match[1];
			if (match[2] !== 'XX')
				dcp.subtitles = match[2];
			return;
		}

		// Territory and rating
		match = territoryRegex.exec(token);
		if (match && match.length === 3) {
			dcp.territory = match[1];
			dcp.rating = match[2];
			return;
		}

		// Audio
		match = audioRegex.exec(token);
		if (match && match.length === 3) {
			dcp.audio = match[1];
			dcp.audioLanguage = match[2];
			return;
		}

		// Resolution
		match = resolutionRegex.exec(token);
		if (match) {
			dcp.resolution = match[1];
			return;
		}

		// Studio
		match = studioRegex.exec(token);
		if (!matched.studio && match) {
			dcp.studio = match[1];
			matched.studio = true;
			return;
		}

		// Date
		match = dateRegex.exec(token);
		if(match) {
			dcp.date = new Date(match[1], match[2], match[3]);
			return;
		}

		// Facility
		match = facilityRegex.exec(token);
		if (match) {
			dcp.facility = match[1];
			return;
		}

		// 3D
		match = dimensionRegex.exec(token);
		if (match) {
			dcp.threeD = true;
			if (match[1] === 'gb')
				dcp.ghostbusted = true;
			else if (match[1] === 'ngb')
				dcp.ghostbusted = false;
			return;
		}

		// Type
		match = versionRegex.exec(token);
		if (match) {
			dcp.version = match[1];
			return;
		}

	});

	return dcp;
};