const fileService = require('../services/file-service');

class FileController {
  async uploadAvatar(req, res, next) {
    try {
      const { userId } = req.params;
      const avatarUrl = `/static/avatars/${req.file.filename}`;
      const uploadedAvatarUrl = await fileService.uploadAvatar(userId, avatarUrl);
      res.json(uploadedAvatarUrl);
    } catch (e) {
      next(e);
    }
  }

  async removeAvatar(req, res, next) {
    try {
      const { userId } = req.body;
      console.log('file-controller userId', userId);
      await fileService.removeAvatar(userId);
      res.json(userId);
    } catch (e) {
      next(e);
    }
  }

  async uploadPicture(req, res, next) {
    try {
      const pictureUrl = `/static/pictures/${req.file.filename}`;
      res.json(pictureUrl);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FileController();
