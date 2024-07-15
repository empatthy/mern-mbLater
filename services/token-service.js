const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    const currentToken = await Token.findOne({ user: userId });
    if (currentToken) {
      currentToken.refreshToken = refreshToken;
      return currentToken.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
