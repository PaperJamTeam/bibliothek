/// <reference path='../typings/tsd.d.ts' />

import logger = require('../logger');
import app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	logger.debug('Server listening on port %d', server.address().port);
});

// Handle exits
process.stdin.resume();	//so the program will not close instantly

function exitHandler(options, err) {

	if (options.cleanup)
		true; // Pass
	if (err & err.stack) {
		logger.error(err);
	}

	if(options.exit)
		process.exit(-1);

	logger.debug('Server is shutting down...');
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
