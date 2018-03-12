var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':server');
var debug_db = require('debug')(app_name+':db');
var User = require('../models/user');

// get all users
router.get('/', function(req, res, next) {
  User.find().then(
    (users) => {
      // xhr
      if(req.xhr)
      {
        res.json({success: true, msg: 'users successfully returned', users: users, count: users.length});
      }
      // standard
      else
      {
        res.render('users', {title: 'users', users: users});
      }
    },
    error => {debug_db('there was an error finding the users');}
  );
});

// get single user
router.get('/:id', function(req, res, next) {
  User.find().then(
    (result) => {
      res.render('users', { title: 'users', users: results });
    },
    error => {debug_db('there was an error finding the users');}
  );
});

// post
router.post('/', function(req, res, next)
{
  var new_user = {first_name: 'bill', last_name: 'morrison', email: 'bmorrison@whiteimage.com'};
  
  User.create(new_user, function (err, result) {
    if (err)
    {
      var err = new Error(err);
      err.status = 400;
      next(err);      
    }
    else
    {
      res.json({success: true, msg: 'user successfully created'});
    }
  });
});

// put
router.put('/:id', function(req, res, next)
{
  var update = {first_name: req.body.first_name};
  
  User.findByIdAndUpdate(req.params.id, update, function (err, user) {
    if (err)
    {
      var err = new Error(err);
      err.status = 400;
      next(err);      
    }
    else
    {
      res.json({success: true, msg: 'user successfully updated'});
    }
  });
});

// delete
router.delete('/:id', function(req, res, next)
{  
  User.deleteOne({_id: req.params.id}, function (err, result) {
    if (err)
    {
      var err = new Error(err);
      err.status = 400;
      next(err);
    }
    else
    {
      // user deleted
      if(result.n === 1 && result.ok === 1)
      {
        res.json({success: true, msg: 'user deleted'});
      }
      else
      {
        res.json({success: false, msg: 'user not deleted'});
      }
    }
  });
});

module.exports = router;
