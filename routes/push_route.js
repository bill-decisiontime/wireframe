var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':push_route');

/* GET home page. */
router.get('/', function(req, res, next)
{
  res.render('push', { title: 'push' });
});

module.exports = router;
