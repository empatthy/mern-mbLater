const { Schema, model } = require('mongoose');

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  //isAdmin: { type: Boolean, required: true },
  //isEditor: { type: Boolean, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: String,
  avatarUrl: String,
});

module.exports = model('User', user);
