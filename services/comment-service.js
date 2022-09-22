const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const Notification = require('../models/Notification');

class CommentService {
  async addComment(body, articleId, userId, date) {
    const comment = await Comment.create({
      body,
      article: articleId,
      author: userId,
      date,
    });
    const commentToReturn = Comment.findOne({ _id: comment._id })
      .populate('author', ['name', 'avatarUrl'])
      .populate('article', '_id');
    return commentToReturn;
  }

  async patchComment(commentId, commentBody) {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { body: commentBody },
      { new: true },
    ).populate('author', ['name', 'avatarUrl']);
    return comment;
  }

  async deleteComment(commentId) {
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId });
    await Notification.deleteMany({ to: commentId });

    if (deletedComment.answerTo) {
      await Comment.updateOne(
        { _id: deletedComment.answerTo },
        { $pullAll: { replies: [commentId] } },
      );
      await Notification.deleteMany({ to: deletedComment.answerTo });
    }

    const commentReplies = await Comment.find({ answerTo: commentId });
    if (commentReplies) {
      await Comment.deleteMany({ answerTo: commentId });
      for (const item of commentReplies) {
        await Reaction.deleteMany({ $or: [{ to: item._id }, { to: commentId }] });
        await Notification.deleteMany({ to: item._id });
      }
    }
    return commentId;
  }

  async replyComment(body, articleId, userId, date, answerTo) {
    const comment = await Comment.create({
      body,
      article: articleId,
      author: userId,
      date,
      answerTo,
    });
    const { _id } = comment;
    await Comment.findOneAndUpdate({ _id: answerTo }, { $addToSet: { replies: _id } });
    const commentToReturn = Comment.findOne({ _id: comment._id })
      .populate('answerTo', '_id')
      .populate('author', ['name', 'avatarUrl'])
      .populate('article', '_id');
    return commentToReturn;
  }

  async getArticleComments(articleId) {
    const comments = await Comment.find({ article: articleId, answerTo: null })
      .populate('author', ['name', 'avatarUrl'])
      .populate('article', '_id')
      .populate('answerTo', '_id');
    return comments;
  }

  async getArticleCommentsCount(articleId) {
    const comments = await Comment.find({ article: articleId });
    return comments;
  }

  async getCommentReplies(commentId) {
    const replies = await Comment.find({ answerTo: commentId })
      .populate('author', ['name', 'avatarUrl'])
      .populate('article', '_id')
      .populate('answerTo', '_id');
    return replies;
  }
}

module.exports = new CommentService();
