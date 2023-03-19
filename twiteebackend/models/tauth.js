const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    code_verifier: { type: String  },
    state: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
  }, { collection : 'tokens' });

  const verifier = mongoose.model('verify', tokenSchema);

  module.exports = verifier