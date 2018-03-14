var UsersCollection = Backbone.Collection.extend({
  url: '/users',
  model: UserModel,
  parse: function(data)
  {
    return data.users;
  }
});
