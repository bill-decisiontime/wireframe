var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':push_route');

const webpush = require('web-push');

/**
 * push
 */
 const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
 const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
 webpush.setVapidDetails('mailto:bill.morrison@teamsolutionz.com', publicVapidKey, privateVapidKey);

//aws
const Consumer = require('sqs-consumer');
SQS_QUEUE_URL = 'https://sqs.eu-west-2.amazonaws.com/065479731380/billtest';

/* GET home page. */
router.post('/', function(req, res, next)
{
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

module.exports = router;
