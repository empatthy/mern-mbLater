const reactionService = require('../services/reaction-service');

class ReactionController {
  async addReaction(req, res, next) {
    try {
      const { to, userId, reactionType } = req.body;
      const reaction = await reactionService.addReaction(to, userId, reactionType);
      return res.json(reaction);
    } catch (e) {
      next(e);
    }
  }

  async getAllReactions(req, res, next) {
    try {
      const reactions = await reactionService.getAllReactions();
      return res.json(reactions);
    } catch (e) {
      next(e);
    }
  }

  async getItemReactions(req, res, next) {
    try {
      const { to } = req.params;
      const reactions = await reactionService.getItemReactions(to);
      return res.json(reactions);
    } catch (e) {
      next(e);
    }
  }

  async removeReaction(req, res, next) {
    try {
      const { to, userId } = req.body;

      await reactionService.removeReaction(to, userId);
      return res.status(200).json({ to, userId });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ReactionController();
