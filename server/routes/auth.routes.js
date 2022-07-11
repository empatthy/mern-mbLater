const { Router } = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth-controller');
const router = Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 16 }),
  authController.registration,
);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/activate/:link', authController.activate);
router.get('/refresh', authController.refresh);

module.exports = router;
