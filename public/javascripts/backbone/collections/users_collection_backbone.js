var UsersCollection = Backbone.PageableCollection.extend({
  url: '/users',
  model: UserModel,
  parse: function(data)
  {
    this.limit = data.users.limit;
    this.page = data.users.page;
    this.pages = data.users.pages;
    this.total = data.users.total;
    return data.users.docs;
  },
  state: {
    pageSize: 10
  }
});
