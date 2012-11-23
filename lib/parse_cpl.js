/**
 * CPL parser
 */
var Stream = require('stream'),
	sax = require('sax');

// Simple addition to arrays to get the last element
Array.prototype.last = function() {
	return this.slice(-1)[0];
};

/**
 * Parses a CPL using simple regular expressions
 * DEPRECATED: in favour of streaming parser
 */
var parseCPLRegex = function(xml) {
	var metadata = {};

	// CPL id
	var idRegex = /(?:<Id>)(.*?)(?:<\/Id>)/;
	var idMatch = idRegex.exec(xml);
	if (idMatch) {
		metadata.id = idMatch[1];
		// Remove the string "urn:uuid:" from the beginning of the id
		metadata.id = metadata.id.replace("urn:uuid:", "");
	}

	// CPL type
	var typeRegex = /(?:<ContentKind>)(.*?)(?:<\/ContentKind>)/;
	var typeMatch = typeRegex.exec(xml);
	if (typeMatch) {
		metadata.type = typeMatch[1];
	}

	// CPL issuer
	var issuerRegex = /(?:<Issuer>)(.*?)(?:<\/Issuer>)/;
	var issuerMatch = issuerRegex.exec(xml);
	if (issuerMatch) {
		metadata.issuer = issuerMatch[1];
	}

	// CPL text
	var textRegex = /(?:<AnnotationText>)(.*?)(?:<\/AnnotationText>)/;
	var textMatch = textRegex.exec(xml);
	if (textMatch) {
		metadata.text = textMatch[1];
	}

	// CPL title
	var titleRegex = /(?:<ContentTitleText>)(.*?)(?:<\/ContentTitleText>)/;
	var titleMatch = titleRegex.exec(xml);
	if (titleMatch) {
		metadata.title = titleMatch[1];
	}

	return metadata;
};

/**
 * Parses CPLs and returns the resulting data in a callback
 *
 * Example:
 *
 * cplParser.parseCPL(fs.readFileSync('cpl.xml', 'UTF-8'), function(err, cpl) {
 *   if (err) return console.error(err);
 *    console.log(cpl);
 * });
 *
 */
var parse = function(cplXML, cb) {
	var stream = new Stream();
	var cplStream = createStream();
	stream.pipe(cplStream);

	var errors = null;
	cplStream.on('error', function(err) {
		if (errors === null) errors = [];
		errors.push(err);
	});

   	cplStream.on('cpl', function(data) {
   		cb(errors, data);
   	});

   	stream.emit('data', cplXML);
   	stream.emit('end');
};

/**
 * Streaming parser for CPLs
 *
 * Example:
 *
 * 	var cplStream = cplParser.createStream();
 *  fs.createReadStream('cpl.xml').pipe(cplStream);
 *  cplStream.on('cpl', function(cpl) {
 *    console.log(cpl);
 *  });
 *
 */
var createStream = function() {
	var saxStream = sax.createStream(false, {trim: true});
	var cpl = {reels: []};
	var tag = null;
	var level = 'root';

	saxStream.on('opentag', function (n) {
		tag = n.name;
		// Are we entering a reel?
		if (tag === 'REEL') {
			level = 'reel';
			// Create a new reel
			cpl.reels.push({});
		}
	});

	saxStream.on('closetag', function (n) {
		tag = n.name;
		// Are we leaving a reel?
		if (tag === 'REEL')
			level = 'root';
	});

	saxStream.on('text', function (t) {
		if (level === 'root')
			switch (tag) {
				case 'ID':
					cpl.id = t.replace("urn:uuid:", "");
					break;
				case 'ISSUER':
					cpl.issuer = t;
					break;
				case 'ISSUEDATE':
					cpl.issueDate = new Date(t);
					break;
				case 'CREATOR':
					cpl.creator = t;
					break;
				case 'ANNOTATIONTEXT':
					cpl.text = t;
					break;
				case 'CONTENTTITLETEXT':
					cpl.titleText = t;
					break;
				case 'CONTENTKIND':
					cpl.type = t;
					break;
			}
		else if (level === 'reel') {
			var currentReel = cpl.reels.last();
			switch (tag) {
				case 'ID':
					currentReel.id = t.replace("urn:uuid:", "");
					break;
				case 'EDITRATE':
					currentReel.editRate = t.split(' ');
					break;
				case 'SCREENASPECTRATIO':
					currentReel.aspectRatio = Number(t);
					break;
				case 'DURATION':
					currentReel.frames = Number(t);
					break;
			}
		}
	});

	// Fire event with the CPL data
	saxStream.on('end', function(text) {
		saxStream.emit('cpl', cpl);
	});

	return saxStream;
};

// Exports
exports.parse = parse;
exports.createStream = createStream;