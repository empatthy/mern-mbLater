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

  async addArticle(req, res, next) {
    try {
      const { title, description, body, author, date } = req.body;
      const article = await articleService.addArticle(title, description, body, author, date);
      return res.json(article);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ArticleController();
