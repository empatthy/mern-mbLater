const Article = require('../models/Article');

class ArticleService {
  async getArticles() {
    const articles = await Article.find().populate('author', 'name');
    return articles;
  }

  async addArticle(title, description, body, author, date) {
    const article = await Article.create({ title, description, body, author, date });
    console.log('article-service/article', article);
    return article;
  }
}

module.exports = new ArticleService();
