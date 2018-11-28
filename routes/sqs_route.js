var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':sqs_route');

//aws
const Consumer = require('sqs-consumer');

router.get('/', function(req, res, next)
{
  const app = Consumer.create({
    region: 'eu-west-2',
    queueUrl: process.env.SQS_QUEUE_URL,
    waitTimeSeconds: 20,
    handleMessage: (message, done) => {
      console.log(message);
      debug(message);
      done();
    }
  });

  app.on('error', (err) => {
    console.log(err.message);
  });

  app.start();
   
  res.render('sqs', { title: 'sqs' });
});

module.exports = router;
