'use strict';

const logger = require('../logger');
const app = require('../app');

const https = require('https');
const fs = require('fs');

var options = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.crt'),
	requestCert: false,
	rejectUnauthorized: false,
};

app.set('port', process.env.PORT || 3000);

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));


var server = https.createServer(options, app).listen(app.get('port'), function () {
	logger.debug(`HTTPS server listening on port ${server.address().port}`);
});


function exitHandler(options, err) {

	if (options.cleanup)
		true; // Pass
	if (err & err.stack) {
		logger.error(err);
	}

	if (options.exit)
		process.exit(-1);

	logger.debug('Server is shutting down...');
	require('mongoose').connection.close();
}