var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':push_route');

//aws
const Consumer = require('sqs-consumer');
SQS_QUEUE_URL = 'https://sqs.eu-west-2.amazonaws.com/065479731380/billtest';

/* GET home page. */
router.get('/', function(req, res, next)
{
  res.render('push', { title: 'push' });
});

module.exports = router;
