const { Router } = require('express');
const notificationController = require('../controllers/notification-controller');

const router = Router();

router.post('/createNotification', notificationController.createNotification);
router.get('/getNotifications', notificationController.getNotifications);
router.delete('/removeNotification', notificationController.removeNotification);
router.post('/allNotificationsRead', notificationController.allNotificationsRead);

module.exports = router;
