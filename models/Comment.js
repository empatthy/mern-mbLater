const { Schema, model, Types } = require('mongoose');

const comment = new Schema({
  body: { type: String, required: true },
  author: [{ type: Types.ObjectId, ref: 'User' }],
  date: { type: Date, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  answers: [{ type: Types.ObjectId, ref: 'Comment' }],
});

module.exports = model('Comment', comment);
