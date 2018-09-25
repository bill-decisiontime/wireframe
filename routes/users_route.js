var express = require('express');
var router = express.Router();
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':server');
var debug_db = require('debug')(app_name+':db');
var User = require('../models/user_model_mongoose');
var random_avatar = require('random-avatar');

// get all users with pagination
router.get('/', function(req, res, next)
{
  var page = req.query.page || 1;
  
  debug('page: '+page);
  debug('req.query.per_page: '+req.query.per_page);
  
  User.paginate({}, { page: page, limit: parseInt(req.query.per_page) }).then(
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

function update_handler(req, res, next)
{
  var new_user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    avatar: req.body.avatar ? req.body.avatar : 'https://api.adorable.io/avatars/285/'+req.body.email+'.png'
  };

  User.create(new_user, function (err, result) {
    if (err)
    {
      var err = new Error(err);
      err.status = 400;
      next(err);
    }
    else
    {
      res.json(result);
    }
  });  
}

// post
router.post('/', update_handler);

// put
router.put('/:id', update_handler);

// put
router.patch('/:id', function(req, res, next)
{
  var update = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    avatar: req.body.avatar,
    email: req.body.email,
  };

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
        res.json({success: true, msg: 'user deleted', result: result});
      }
      else
      {
        res.json({success: false, msg: 'user not deleted', result: result});
      }
    }
  });
});

module.exports = router;
