Backbone.Collection.prototype.debugEvents =
Backbone.Model.prototype.debugEvents =
Backbone.View.prototype.debugEvents =
Backbone.Router.prototype.debugEvents = function() {
    this.on('all', function(eventName) {
        console.log('[debug event] --> ', eventName, Array.prototype.slice.call(arguments, 1))
    })
}

// users view
var UsersView = Backbone.View.extend(
{
  el: '#users_table',
  
  initialize: function()
  {
    this.listenTo(this.collection, 'sync', this.render);
    this.listenTo(this.collection, 'sync', this.check_for_no_results);
    this.listenTo(this.collection, 'destroy', this.check_for_no_results);
  },
  
  render: function()
  {
    // empty the body
    var table_body = this.$('tbody');
    table_body.empty();
    
    // populate the list
    this.collection.each(function(model)
    {
      //model.debugEvents();
      var user = new UserView({model: model});
      table_body.append(user.render().$el);
    }, this);
    
    return this;
  },
  
  check_for_no_results: function()
  {
    if(this.collection.length === 0)
    {
      this.$el.addClass('d-none');
    }
    else
    {
      this.$el.removeClass('d-none');
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
    
    var confirm_the_delete = confirm("Are you sure you want to delete this user?");
    if(confirm_the_delete) this.model.destroy();   
  },
  
  update_user: function(event)
  {
    event.preventDefault();
    this.model.set({first_name: 'bob'});
    this.model.save({wait: true});
  }
});

// add user
var AddUserView = Backbone.View.extend(
{
  el: '#add_user_form',
  
  initialize: function()
  {
    this.listenTo(this.collection, 'sync', this.reset_view);
  },
  
  reset_view: function()
  {
    this.el.reset();
  },
  
  events: {
    'submit': 'add_user'
  },
  
  add_user: function(event)
  {
    var that = this;
    event.preventDefault();
    
    // els
    var btn_el = this.$('#submit_btn');
    var btn_el_icon = this.$('#submit_btn_icon');
    var btn_el_loader = this.$('#submit_btn_loader');
    
    // for avatar
    var genders = ['men', 'women'];
    var random_gender_index = Math.floor(Math.random()*genders.length);
    var random_int = Math.floor(Math.random()*100);
    
    var avatar = ( ! _.isEmpty(this.$('#avatar').val())) ? this.$('#avatar').val() : 'https://randomuser.me/api/portraits/'+genders[random_gender_index]+'/'+random_int+'.jpg';
    
    // get the attrs from form
    var new_user_attrs = {
      first_name: this.$('#first_name').val(),
      last_name: this.$('#last_name').val(),
      email: this.$('#email').val(),
      avatar: avatar
    };
    
    var options = {
      wait: true,
      success: function(model, response, options)
      {
        // show loading state
        btn_el.attr('disabled', false);
        btn_el_icon.toggle();
        btn_el_loader.toggle();
        
      },
      failure: function(model, response, options){}
    };    
    
    var new_user = this.collection.create(new_user_attrs, options);
    new FormErrorFeedbackView({model: new_user});
    
    // invalid
    if( ! new_user.isValid())
    {
      new_user.trigger('form:validation_error');
    }
    // valid
    else
    {
      // show loading state
      btn_el.attr('disabled', true);
      btn_el_icon.toggle();
      btn_el_loader.toggle();
            
      new_user.trigger('form:validation_success');
    }
  }  
});

// add user
var FormErrorFeedbackView = Backbone.View.extend(
{
  el: '#form_error_feedback_container',
  template: _.template($('#form_error_feedback_tmpl').html()),
  
  initialize: function()
  {
    this.listenTo(this.model, 'form:validation_error', this.render);
    this.listenTo(this.model, 'form:validation_success', this.hide);
  },
  
  render: function()
  {
    var data_for_template = {errors: this.model.validationError};
    var html = $(this.template(data_for_template));
    this.$el.html(html);
    
    // focus on first error
    $('#'+this.model.validationError[0].attr+'').focus();
    
    return this;   
  },
  
  hide: function()
  {
    this.$el.html('');
  }
});
