const articleService = require('../services/article-service');

class ArticleController {
  async getArticles(req, res, next) {
    try {
      const articles = await articleService.getArticles();
      return res.json(articles);
    } catch (e) {
      next(e);
    }
  }

  async getArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      const article = await articleService.getArticle(articleId);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }

  async getUserArticles(req, res, next) {
    try {
      const { userId } = req.params;
      const articles = await articleService.getUserArticles(userId);
      return res.json(articles);
    } catch (e) {
      next(e);
    }
  }

  async addArticle(req, res, next) {
    try {
      const { title, body, author, date, pictureUrl } = req.body;
      const article = await articleService.addArticle(title, body, author, date, pictureUrl);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }

  async patchArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      const { title, body, author, pictureUrl } = req.body;
      const article = await articleService.patchArticle(articleId, title, body, author, pictureUrl);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }

  async deleteArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      await articleService.deleteArticle(articleId);
      return res.json(articleId);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ArticleController();
