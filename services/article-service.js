const Article = require('../models/Article');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');

class ArticleService {
  async getArticles() {
    const articles = await Article.find().populate('author', 'name');
    return articles;
  }

  async getUserArticles(userId) {
    const articles = await Article.find({ author: userId }).populate('author', 'name');
    return articles;
  }

  async addArticle(title, description, body, author, date) {
    const article = await Article.create({ title, description, body, author, date });
    return article;
  }

  async deleteArticle(articleId) {
    await Article.deleteOne({ _id: articleId });
    await Reaction.deleteMany({ article: articleId });
    await Comment.deleteMany({ article: articleId });
    return articleId;
  }
}

module.exports = new ArticleService();
