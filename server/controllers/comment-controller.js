const commentService = require('../services/comment-service');

class CommentController {
  async addComment(req, res, next) {
    try {
      const { body, articleId, userId, date } = req.body;
      const comment = await commentService.addComment(body, articleId, userId, date);
      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  async replyComment(req, res, next) {
    try {
      const { body, articleId, userId, date, answerTo } = req.body;
      const comment = await commentService.replyComment(body, articleId, userId, date, answerTo);
      return res.json(comment);
    } catch (e) {
      next(e);
    }
  }

  async getArticleComments(req, res, next) {
    try {
      const { articleId } = req.params;
      const comments = await commentService.getArticleComments(articleId);
      return res.json(comments);
    } catch (e) {
      next(e);
    }
  }

  async getCommentReplies(req, res, next) {
    try {
      const { commentId } = req.query;
      console.log('commentId', commentId);
      const replies = await commentService.getCommentReplies(commentId);
      return res.json(replies);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CommentController();
