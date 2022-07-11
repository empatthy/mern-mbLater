const { Schema, model, Types } = require('mongoose');

const reaction = new Schema({
  to: { type: Types.ObjectId, ref: 'Article', required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  reactionType: { type: Boolean, required: true },
});

module.exports = model('Reaction', reaction);
