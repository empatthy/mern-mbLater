const Notification = require('../models/Notification');

class NotificationService {
  async createNotification(senderId, receiverId, notificationType, date, to) {
    const notification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      notificationType,
      date,
      to,
    });
    return notification;
  }

  async removeNotification(senderId, to) {
    await Notification.deleteOne({ sender: senderId, to: to });
  }

  async getNotifications(userId) {
    const notifications = await Notification.find({ receiver: userId })
      .populate('sender', 'name')
      .populate('receiver', '_id');
    return notifications;
  }

  async allNotificationsRead(receiverId) {
    const notifications = await Notification.updateMany(
      { receiverId: receiverId },
      { read: true, new: false },
    );
    return notifications;
  }
}

module.exports = new NotificationService();
