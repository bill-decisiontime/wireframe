var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':twitter_route');
var twitter = require('twitter');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var io = req.app.get("io");
  
  var client = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  
  var track_string = 'bbc news';
  
  /**
   * Stream statuses filtered by keyword
   * number of tweets per second depends on topic popularity
   **/
  client.stream('statuses/filter', {track: track_string}, function(stream)
  {
    stream.on('data', function(tweet)
    {
      io.emit('got_tweet', tweet.text);
      debug(tweet.text);
    });

    stream.on('error', function(error)
    {
      console.log(error);
    });
  });  
  
  res.render('twitter', { title: 'twitter', track_string: track_string });
});

module.exports = router;
