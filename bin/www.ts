/// <reference path='../typings/tsd.d.ts' />

import debugModule = require('debug');
import app = require('../app');

var debug = debugModule('Bibliothek');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	debug('Server listening on port %d', server.address().port);
});
