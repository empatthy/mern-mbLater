const { Schema, model, Types } = require('mongoose');

const article = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  comments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
});

module.exports = model('Article', article);
