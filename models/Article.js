const { Schema, model, Types } = require('mongoose');

const article = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },
  comments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
  views: { type: Number, default: 0 },
  pictureUrl: String,
});

module.exports = model('Article', article);
