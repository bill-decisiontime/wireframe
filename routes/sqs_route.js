var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':sqs_route');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sqs', { title: 'sqs' });
});

module.exports = router;
