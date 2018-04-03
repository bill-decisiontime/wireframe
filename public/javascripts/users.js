var add_user_view;

$( document ).ready(function()
{
  var users_collection = new UsersCollection();
  var users_view = new UsersView({collection: users_collection});

  // get the collection
  users_collection.getFirstPage();
  
  // init the add user form
  add_user_view = new AddUserView({collection: users_collection});
  
  // init the feedback view
  new FormErrorFeedbackView({collection: users_collection});
  
  // init the pagination view
  var pagination_view = new PaginationView({collection: users_collection});
});
