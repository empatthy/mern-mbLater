const Comment = require('../models/Comment');

class CommentService {
  async addComment(body, articleId, userId, date) {
    const comment = await Comment.create({
      body,
      article: articleId,
      author: userId,
      date,
    });
    return comment;
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
    return comment;
  }

  async getArticleComments(articleId) {
    const comments = await Comment.find({ article: articleId, answerTo: null })
      .populate('author', 'name')
      .populate('article', '_id');
    return comments;
  }

  async getCommentReplies(commentId) {
    const replies = await Comment.find({ answerTo: commentId })
      .populate('author', 'name')
      .populate('article', '_id')
      .populate('answerTo', '_id');
    console.log('replies', replies);
    return replies;
  }
}

module.exports = new CommentService();
