const User = require('../models/User');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
  async getUserById(userId) {
    const userData = await User.find({ _id: userId });

    const userDto = new UserDto(...userData);
    return userDto;
  }
}

module.exports = new UserService();
