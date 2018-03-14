$( document ).ready(function()
{
  var users_collection = new UsersCollection();
  //users_collection.debugEvents();
  var users_view = new UsersView({collection: users_collection});

  var options = {
    success: function(collection, response, options){},
    failure: function(){}
  };

  // get the collection
  users_collection.fetch(options);
  
  // init the add user form
  new AddUserView({collection: users_collection});
  
  // init the feedback view
  new FormErrorFeedbackView({collection: users_collection});
});
