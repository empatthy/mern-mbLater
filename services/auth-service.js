const User = require('../models/User');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class AuthService {
  async registration(name, email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с этим адресом уже зарегистрирован`);
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await User.create({ name, email, password: hashedPassword, activationLink });
    /* await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`,
    ); */

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким адресом не зарегистрирован');
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      throw ApiError.BadRequest('Неверный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData._id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveRefreshToken(userDto._id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }
}

module.exports = new AuthService();
