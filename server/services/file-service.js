const User = require('../models/User');
const fs = require('fs');
const Article = require('../models/Article');

class FileService {
  async uploadAvatar(userId, avatarUrl) {
    console.log('fileService', userId, avatarUrl);
    const condidate = await User.findById(userId);

    if (condidate.avatarUrl) {
      const user = await User.findById(userId);
      console.log('file-service avatarUrl', user);
      const { avatarUrl } = user;
      fs.unlink('.' + avatarUrl, (err) => {
        if (err) throw err;
      });

      await User.findByIdAndUpdate(userId, { avatarUrl: '' });
    }
    await User.findByIdAndUpdate(userId, { avatarUrl: avatarUrl });
    return avatarUrl;
  }

  async removeAvatar(userId) {
    const user = await User.findById(userId);
    console.log('file-service avatarUrl', user);
    const { avatarUrl } = user;
    fs.unlink('.' + avatarUrl, (err) => {
      if (err) throw err;
    });
    await User.findByIdAndUpdate(userId, { avatarUrl: '' });
    return userId;
  }
}

module.exports = new FileService();
