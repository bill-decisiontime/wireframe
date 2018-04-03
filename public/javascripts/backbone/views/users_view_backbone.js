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
    this.listenTo(this.collection, 'destroy', this.pagination_get_current_page);
    this.user_count_view = new UserCountView({collection: this.collection});
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
  },
  
  pagination_get_current_page: function()
  {
    // get the current page
    this.collection.getPage(parseInt(this.collection.page));
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
    'click .update_user_init': 'update_user_init',
    'click .update_user': 'update_user'
  },
  
  delete_user: function(event)
  {
    event.preventDefault();
    
    var confirm_the_delete = confirm("Are you sure you want to delete this user?");
    
    if(confirm_the_delete)
    {
      this.model.destroy();
    }
  },
  
  update_user_init: function(event)
  {
    event.preventDefault();
    
    // show udate icon
    this.$('.update_user').show();
    this.$('.update_user_init').hide();
    
    // show avatar url
    this.$('.user_avatar_uri').show();
    this.$('.user_avatar_img').hide();    
    
    // make content editable
    this.$('.user_avatar_uri').attr('contenteditable', true).focus();
    this.$('.user_first_name').attr('contenteditable', true);
    this.$('.user_last_name').attr('contenteditable', true);
    this.$('.user_email').attr('contenteditable', true);
  },
  
  update_user: function()
  {
    var that = this;
    
    var new_user_attrs = {
      avatar: this.$('.user_avatar_uri').text(),
      first_name: this.$('.user_first_name').text(),
      last_name: this.$('.user_last_name').text(),
      email: this.$('.user_email').text(),
    };
    
    this.model.set(new_user_attrs);
    
    new FormErrorFeedbackView({model: this.model})
    
    // invalid
    if( ! this.model.isValid())
    {
      this.model.trigger('form:validation_error');
    }
    // valid
    else
    {
      // show loading state
      this.$('.update_user_loader').show();
      this.$('.update_user').hide();
            
      this.model.trigger('form:validation_success');
      
      var options = {
        wait: true,
        patch: true,
        success: function(model, response, options)
        {
          // show loading state
          that.$('.update_user_loader').hide();
          that.$('.update_user').show();
        },
        error: function(model, response, options){}
      };       
            
      this.model.save(null, options);        
    }
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
    // change the submit btn text
    this.$('#submit_btn_text').text('add');
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
    
    // get the attrs from form
    var new_user_attrs = {
      first_name: this.$('#first_name').val(),
      last_name: this.$('#last_name').val(),
      email: this.$('#email').val()
    };
    
    // for avatar
    var genders = ['men', 'women'];
    var random_gender_index = Math.floor(Math.random()*genders.length);
    var random_int = Math.floor(Math.random()*100);

    //var avatar = ( ! _.isEmpty(this.$('#avatar').val())) ? this.$('#avatar').val() : 'https://randomuser.me/api/portraits/'+genders[random_gender_index]+'/'+random_int+'.jpg';
    var avatar = ( ! _.isEmpty(this.$('#avatar').val())) ? this.$('#avatar').val() : '';
    new_user_attrs.avatar = avatar;

    var options = {
      wait: true,
      success: function(model, response, options)
      {
        // show loading state
        btn_el.attr('disabled', false);
        btn_el_icon.toggle();
        btn_el_loader.toggle();
        that.reset_view();
        
        // get the current page
        that.collection.getPage(parseInt(that.collection.page));
      },
      failure: function(model, response, options){}
    };    

    var new_user = this.collection.push(new_user_attrs);
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
      this.collection.sync('create', new_user, options);
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

// pagination view
var PaginationView = Backbone.View.extend(
{
  el: '#pagination_container',
  template: _.template($('#pagination_tmpl').html()),
  
  initialize: function()
  {
    this.listenTo(this.collection, 'sync', this.render);
  },
  
  render: function()
  {
    var page_items = [];
    
    // previous
    page_items.push({
      label: 'Previous', 
      state: this.collection.page === "1" ? 'disabled' : '',
      goto_page: this.collection.page-1
    });
    
    for (var i = 1; i <= this.collection.pages; i++)
    {
      page_items.push({
        label: i, 
        state: this.collection.page === i.toString() ? 'active' : '',
        goto_page: i
      });
    }
    
    // next
    page_items.push({
      label: 'Next', 
      state: this.collection.page === this.collection.pages.toString() ? 'disabled' : '',
      goto_page: parseInt(this.collection.page)+1
    });
    
    var data_for_template = {
      page_items: page_items
    };
    
    var html = $(this.template(data_for_template));
    this.$el.html(html);
    
    return this;   
  },
  
  events: {
    'click .page-link': 'goto_page'
  },
  
  goto_page: function(event)
  {
    event.preventDefault();
    var target_el = $(event.target);
    var goto_page = parseInt(target_el.attr('data-goto_page'));
    
    this.collection.getPage(goto_page).done(function()
    {
      
    });
  }
});

// user count
var UserCountView = Backbone.View.extend(
{
  el: '#users_count',
  
  initialize: function()
  {
    this.listenTo(this.collection, 'sync', this.render);
  },
  
  render: function()
  {
    this.$('.users_count_number').text(this.collection.total);
    return this;   
  }
});
