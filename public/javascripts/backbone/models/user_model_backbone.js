var MAX_FIRST_NAME_LENGTH = 1024;
var MAX_LAST_NAME_LENGTH = 1024;
var MAX_EMAIL_LENGTH = 1024;

var UserModel = Backbone.Model.extend({
  idAttribute: '_id',
  
  defaults: {
    _id: null,
    __v: null,
    first_name: null,
    last_name: null,
    email: null,
    avatar: null, 
    createdAt: null,
    updatedAt: null
  },  
  
  validate: function(attrs, options)
  {
    var validation_errors = [];
    
    // first name - required
    if(attrs.first_name.length === 0)
    {
      validation_errors.push({msg: 'first name is a required field', attr: 'first_name'});
    }
    
    // first name - max length
    if(attrs.first_name.length > MAX_FIRST_NAME_LENGTH)
    {
      validation_errors.push({msg: 'first name is too long, maximum of '+MAX_FIRST_NAME_LENGTH+' characters.', attr: 'first_name'});
    }
    
    // last name - required
    if(attrs.last_name.length === 0)
    {
      validation_errors.push({msg: 'last name is a required field', attr: 'last_name'});
    }
    
    // last name - max length
    if(attrs.last_name.length > MAX_LAST_NAME_LENGTH)
    {
      validation_errors.push({msg: 'last name is too long, maximum of '+MAX_LAST_NAME_LENGTH+' characters.', attr: 'last_name'});
    }
    
    // email - required
    if(attrs.email.length === 0)
    {
      validation_errors.push({msg: 'email is a required field', attr: 'email'});
    }
    
    // email - max length
    if(attrs.email.length > MAX_EMAIL_LENGTH)
    {
      validation_errors.push({msg: 'email is too long, maximum of '+MAX_EMAIL_LENGTH+' characters.', attr: 'email'});
    }
    
    var pattern = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    
    // avatar - is url
    if(attrs.avatar.length > 0 && ! pattern.test(attrs.avatar))
    {
      validation_errors.push({msg: 'If you enter an avatar it must be a valid URL.', attr: 'avatar'});
    }
    
    if(validation_errors.length > 0) return validation_errors;
  }
});
