const { Schema, model, Types } = require('mongoose');

const notification = new Schema({
  sender: { type: Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Types.ObjectId, ref: 'User', required: true },
  notificationType: { type: Number, required: true },
  date: { type: String, required: true },
  to: { type: Types.ObjectId, required: true },
  new: { type: Boolean, required: true, default: true },
  read: { type: Boolean, required: true, default: false },
});

module.exports = model('Notification', notification);
