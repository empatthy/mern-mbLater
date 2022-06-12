const reactionService = require('../services/reaction-service');

class ReactionController {
  async addReaction(req, res, next) {
    try {
      const { articleId, userId, reactionType } = req.body;
      const reaction = await reactionService.addReaction(articleId, userId, reactionType);
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

  async getArticleReactions(req, res, next) {
    try {
      const { articleId } = req.params;
      const reactions = await reactionService.getArticleReactions(articleId);
      return res.json(reactions);
    } catch (e) {
      next(e);
    }
  }

  async removeReaction(req, res, next) {
    try {
      const { articleId, userId } = req.body;

      await reactionService.removeReaction(articleId, userId);
      return res.status(200).json({ articleId, userId });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ReactionController();
