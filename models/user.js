var mongoose = require('mongoose');
require('mongoose-type-email');

// define a schema
var Schema = mongoose.Schema;

var options = {timestamps: true};

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: mongoose.SchemaTypes.Email
}, options);

module.exports = mongoose.model('User', UserSchema);
