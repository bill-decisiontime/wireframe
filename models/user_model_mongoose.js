var mongoose = require('mongoose');
require('mongoose-type-email');
var mongoosePaginate = require('mongoose-paginate');

// define a schema
var Schema = mongoose.Schema;

var options = {timestamps: true};

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: mongoose.SchemaTypes.Email,
  avatar: { type: String, default: 'https://randomuser.me/api/portraits/lego/0.jpg' },
}, options);

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
