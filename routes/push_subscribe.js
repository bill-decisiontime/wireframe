var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':push_route');

const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();

debug(vapidKeys);

var vapid_public_key = "BM9ffDFabDoU845z0QmaR9TEUlX_KAVyeLYRBWagDcjOGv5Ub0-bWQbnK-CoSnt5nCDOpzuiMDqEA-MYnoznWgk";
var vapid_private_key = "dLFM1zK6-dIvG1Y5yjSA260YAS4NLhYaRxbMrrMIU4I";
webpush.setVapidDetails('mailto:bill.morrison@teamsolutionz.com', vapid_public_key, vapid_private_key);

router.post('/', function(req, res, next)
{
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });

  debug(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

module.exports = router;
