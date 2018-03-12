$( document ).ready(function()
{
  var users_collection = new UsersCollection();
  var users_view = new UsersView({collection: users_collection});

  var options = {
    success: function(collection, response, options){},
    failure: function(){}
  };

  // get the collection
  users_collection.fetch(options);
});
