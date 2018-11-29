var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();

var app = express();

// live reload
var livereload = require('livereload');
var server = livereload.createServer({extraExts: ["pug"]});
server.watch([__dirname + "/public", __dirname + "/views"]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// locals
app.locals.pjson = require('./package.json'); // make package json available to views
app.locals.env = app.get('env');

// allowed routes
var index = require('./routes/index_route');
var users = require('./routes/users_route');
var copy = require('./routes/copy_route');
var sqs = require('./routes/sqs_route');
var twitter = require('./routes/twitter_route');

app.use('/', index);
app.use('/users', users);
app.use('/copy', copy);
app.use('/sqs', sqs);
app.use('/twitter', twitter);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next)
{
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next)
{
  'use strict';

  if (req.xhr)
  {
    res.status(err.status || 500).send({ error: err.message || 'Something failed!' });
  }
  else
  {
    next(err);
  }
}

function errorHandler(err, req, res, next)
{
  'use strict';

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

module.exports = app;
