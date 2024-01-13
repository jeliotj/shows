const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  email: { type: String, required: true },
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
