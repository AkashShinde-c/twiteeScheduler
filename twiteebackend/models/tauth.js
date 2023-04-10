const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    code_verifier: { type: String  },
    state: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
  }, { collection : 'tokens' });

  const verifier = mongoose.model('verify', tokenSchema);

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    access_token: { type: String },
    refresh_token: { type: String },
    code_verifier: { type: String  },
    state: { type: String },
  });
  
  const User = mongoose.model('User', userSchema);

  module.exports = {verifier, User}