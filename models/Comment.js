const { Schema, model, Types } = require('mongoose');
const Reaction = require('./Reaction');

const comment = new Schema({
  body: { type: String, required: true },
  article: { type: Types.ObjectId, ref: 'Article', required: true },
  author: { type: Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  answerTo: { type: Types.ObjectId, ref: 'Comment' },
  replies: [String],
});

module.exports = model('Comment', comment);
