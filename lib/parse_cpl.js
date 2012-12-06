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
	var saxStream = sax.createStream(false, {trim: true, xmlns: true});
	var cpl = {duration: 0, frames: 0, reels: []};
	var tag = null;
	var level = 'root';

	saxStream.on('opentag', function (node) {
		tag = node.local;
		switch (tag) {
			case 'REEL':
				level = 'reel';
				// Create a new reel
				cpl.reels.push({});
				break;
			case 'ASSETLIST':
				level = 'assets';
				break;
			case 'MAINSUBTITLE':
				cpl.hasSubtitles = cpl.reels.last().hasSubtitles = true;
				break;
			case 'MAINSTEREOSCOPICPICTURE':
				cpl.threeD = true;
				break;

		}
	});

	saxStream.on('closetag', function (tag) {
		// Are we leaving a reel?
		switch (tag) {
			case 'REEL':
				// Update the global framerate and duration
				var reel = cpl.reels.last();
				if (reel.editRate && reel.frames) {
					cpl.frames += reel.frames;
					cpl.duration += reel.frames / reel.editRate[0];
				}
				level = 'root';
				break;
			case 'ASSETLIST':
				level = 'reel';
				break;
		}
	});

	saxStream.on('text', function (t) {
		var currentReel = cpl.reels.last();
		if (level === 'root')
			switch (tag) {
				case 'ID':
					if ('undefined' === typeof(cpl.id))
						cpl.id = t.replace('urn:uuid:', '');
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
			switch (tag) {
				case 'ID':
					if ('undefined' === typeof(currentReel.id))
						currentReel.id = t.replace('urn:uuid:', '');
					break;
			}
		}
		else if (level === 'assets') {
			switch (tag) {
				case 'EDITRATE':
					currentReel.editRate = t.split(' ');
					currentReel.editRate[0] = Number(currentReel.editRate[0]);
					currentReel.editRate[1] = Number(currentReel.editRate[1]);
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