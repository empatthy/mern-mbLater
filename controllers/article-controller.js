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
      const { title, description, body, author, date } = req.body;
      const article = await articleService.addArticle(title, description, body, author, date);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }

  async deleteArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      console.log(articleId);
      await articleService.deleteArticle(articleId);
      return res.json(articleId);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ArticleController();
