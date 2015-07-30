/// <reference path="typings/tsd.d.ts"/>


import winston = require('winston');

interface BibliothekLogger extends winston.LoggerInstance {
	common(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	common(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;

	input(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	input(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;

	verbose(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	verbose(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;

	prompt(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	prompt(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;

	data(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	data(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;

	help(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	help(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;

	exception(msg: string, meta: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
	exception(msg: string, callback?: (err: Error, level: string, msg: string, meta: any) => void): BibliothekLogger;
}

var logger = <BibliothekLogger> new (winston.Logger)({
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

export = logger;
