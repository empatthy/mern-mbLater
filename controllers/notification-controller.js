const notificationService = require('../services/notification-service');

class NotificationController {
  async createNotification(req, res, next) {
    try {
      const { senderId, receiverId, notificationType, date, to } = req.body;
      const notification = await notificationService.createNotification(
        senderId,
        receiverId,
        notificationType,
        date,
        to,
      );
      return res.json(notification);
    } catch (e) {
      next(e);
    }
  }

  async removeNotification(req, res, next) {
    try {
      const { senderId, to } = req.body;
      await notificationService.removeNotification(senderId, to);
      return res.status(200).json({ senderId, to });
    } catch (e) {
      next(e);
    }
  }

  async getNotifications(req, res, next) {
    try {
      const { userId } = req.query;
      const notifications = await notificationService.getNotifications(userId);
      return res.json(notifications);
    } catch (e) {
      next(e);
    }
  }

  async allNotificationsRead(req, res, next) {
    try {
      const { receiverId } = req.body;
      const notifications = await notificationService.allNotificationsRead(receiverId);
      return res.json(notifications);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new NotificationController();
