const Comment = require('../models/Comment');

class CommentService {
  async addComment(body, articleId, userId, date) {
    const comment = await Comment.create({
      body,
      article: articleId,
      author: userId,
      date,
    });
    const commentToReturn = Comment.findOne({ _id: comment._id })
      .populate('author', 'name')
      .populate('article', '_id');
    return commentToReturn;
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
      .populate('author', 'name')
      .populate('article', '_id');
    return commentToReturn;
  }

  async getArticleComments(articleId) {
    const comments = await Comment.find({ article: articleId, answerTo: null })
      .populate('author', 'name')
      .populate('article', '_id')
      .populate('answerTo', '_id');
    return comments;
  }

  async getCommentReplies(commentId) {
    const replies = await Comment.find({ answerTo: commentId })
      .populate('author', 'name')
      .populate('article', '_id')
      .populate('answerTo', '_id');
    return replies;
  }
}

module.exports = new CommentService();
