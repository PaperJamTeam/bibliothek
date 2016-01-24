'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
	levels: {
		common: 0,
		input: 1,
		verbose: 2,
		prompt: 3,
		debug: 4,
		info: 5,
		data: 6,
		help: 7,
		warn: 8,
		error: 9,
		exception: 10
	},
	colors: {
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
	}
});

logger.add(winston.transports.Console, {
	level: 'common',
	prettyPrint: true,
	colorize: true,
	silent: false,
	timestamp: false
});

logger.add(winston.transports.File, {
	name: 'common-log',
	filename: './logs/common.log',
	level: 'debug'
});

logger.add(winston.transports.File, {
	name: 'error-log',
	filename: './logs/exceptions.log',
	handleExceptions: true,
	level: 'error'
});

module.exports = logger;
