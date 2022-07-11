const Reaction = require('../models/Reaction');

class ReactionService {
  async addReaction(to, userId, reactionType) {
    const reaction = await Reaction.create({
      to: to,
      user: userId,
      reactionType,
    });
    return reaction;
  }

  async getAllReactions() {
    const reactions = await Reaction.find();
    return reactions;
  }

  async getItemReactions(to) {
    const reactions = await Reaction.find({ to: to }).populate('to', '_id');
    return reactions;
  }

  async removeReaction(to, userId) {
    await Reaction.deleteOne({ to: to, user: userId })
      .populate('article', '_id')
      .populate('user', '_id');
  }
}

module.exports = new ReactionService();
