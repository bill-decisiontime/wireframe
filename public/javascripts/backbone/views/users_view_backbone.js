// users view
var UsersView = Backbone.View.extend(
{
  el: '#users_table_body',
  
  initialize: function()
  {
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'destroy', this.check_for_no_results);
    //this.check_for_no_results();
  },
  
  render: function()
  {
    // empty the list
    this.$el.empty();
    
    // populate the list
    this.collection.each(function(model)
    {
      var user = new UserView({model: model});
      this.$el.append(user.render().$el);
    }, this);
    
    this.check_for_no_results();
    
    return this;
  },
  
  check_for_no_results: function(event)
  {
    // no results
    if(this.collection.length === 0)
    {
      this.$el.append('no results');
    }
  }
});

// user view
var UserView = Backbone.View.extend(
{
  tagName: 'tr',
  template: _.template($('#user_tmpl').html()),
  
  initialize: function()
  {
    this.listenTo(this.model, 'destroy', this.remove);
  },
  
  render: function()
  {
    var data_for_template = this.model.toJSON();
    var html = $(this.template(data_for_template));
    this.$el.html(html);
    return this;
  },
  
  events: {
    'click .delete_user': 'delete_user',
    'click .update_user': 'update_user'
  },
  
  delete_user: function(event)
  {
    event.preventDefault();
    this.model.destroy();   
  },
  
  update_user: function(event)
  {
    event.preventDefault();
    this.model.set({first_name: 'bob'});
    this.model.save({wait: true});
  }
});
