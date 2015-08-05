/// <reference path='../typings/tsd.d.ts' />

import logger = require('../logger');
import app = require('../app');

import https = require('https');
import fs = require('fs');

var options = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt'),
	requestCert: false,
	rejectUnauthorized: false
};

app.set('port', process.env.PORT || 3000);

var server = https.createServer(options, app).listen(app.get('port'), function () {
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
	require('mongoose').connection.close();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
