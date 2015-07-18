/// <reference path="../typings/tsd.d.ts"/>

import express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

export = router;
