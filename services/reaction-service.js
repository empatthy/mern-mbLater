const res = require('express/lib/response');
const Reaction = require('../models/Reaction');

class ReactionService {
  async addReaction(articleId, userId, reactionType) {
    const reaction = await Reaction.create({
      article: articleId,
      user: userId,
      reactionType,
    });
    return reaction;
  }

  async getAllReactions() {
    const reactions = await Reaction.find();
    return reactions;
  }

  async getArticleReactions(articleId) {
    const reactions = await Reaction.find({ article: articleId }).populate('article', '_id');
    return reactions;
  }

  async removeReaction(articleId, userId) {
    await Reaction.deleteOne({ article: articleId, user: userId })
      .populate('article', '_id')
      .populate('user', '_id');
  }
}

module.exports = new ReactionService();
