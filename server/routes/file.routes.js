const express = require('express');
const multer = require('multer');
const { Router } = require('express');

const fileController = require('../controllers/file-controller');

const router = Router();

const avatarsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.mimetype.split('/')[1]}`);
  },
});

const picturesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/pictures');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + `.${file.mimetype.split('/')[1]}`);
  },
});

const extensionsWhitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const uploadAvatar = multer({
  storage: avatarsStorage,
  fileFilter: (req, file, cb) => {
    if (!extensionsWhitelist.includes(file.mimetype)) {
      return cb(new Error('Разрешены файлы с расширениями .png .jpeg .jpg .webp'));
    }
    cb(null, true);
  },
});

const uploadPicture = multer({
  storage: picturesStorage,
  fileFilter: (req, file, cb) => {
    if (!extensionsWhitelist.includes(file.mimetype)) {
      return cb(new Error('Разрешены файлы с расширениями .png .jpeg .jpg .webp'));
    }
    cb(null, true);
  },
});

router.post('/uploadAvatar/:userId', uploadAvatar.single('image'), fileController.uploadAvatar);
router.delete('/removeAvatar', fileController.removeAvatar);

router.post('/uploadPicture', uploadPicture.single('image'), fileController.uploadPicture);

module.exports = router;
