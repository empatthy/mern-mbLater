const { Router } = require('express');
const userController = require('../controllers/user-controller');

const router = Router();

router.get('/getUser/:userId', userController.getUserById);

module.exports = router;
