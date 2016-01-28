'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			name: 'common',
			level: 'silly',
			prettyPrint: true,
			colorize: true,
			silent: false,
			timestamp: false
		}),
		new (winston.transports.File)({
			name: 'common-log',
			filename: 'logs/common.log',
			level: 'debug'
		}),
		new (winston.transports.File)({
			name: 'error-log',
			filename: 'logs/errors.log',
			handleExceptions: true,
			level: 'error'
		})
	]
});

winston.addColors({
	common: 'magenta',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	debug: 'blue',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	error: 'red'
});

module.exports = logger;

