/// <reference path='../typings/tsd.d.ts' />

import logger = require('../logger');
import app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	logger.debug('Server listening on port %d', server.address().port);
});
