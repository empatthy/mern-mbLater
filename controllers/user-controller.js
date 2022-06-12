const userService = require('../services/user-service');
const ApiError = require('../exceptions/api-error');

class UserController {
  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const userData = await userService.getUserById(userId);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
