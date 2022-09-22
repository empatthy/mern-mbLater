const Article = require('../models/Article');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');

class ArticleService {
  async getArticles() {
    const articles = await Article.find().populate('author', ['name', 'avatarUrl']);
    return articles;
  }

  async getArticle(articleId) {
    const article = await Article.findOneAndUpdate(
      { _id: articleId },
      { $inc: { views: 1 } },
      { new: true },
    ).populate('author', ['name', 'avatarUrl']);
    return article;
  }

  async getUserArticles(userId) {
    const articles = await Article.find({ author: userId }).populate('author', 'name');
    return articles;
  }

  async addArticle(title, body, author, date, pictureUrl) {
    let article = await Article.create({ title, body, author, date, pictureUrl });
    article = await article.populate('author', ['name', 'avatarUrl']);
    return article;
  }

  async patchArticle(articleId, title, body, author, pictureUrl) {
    const article = await Article.findByIdAndUpdate(
      articleId,
      {
        title,
        body,
        author,
        pictureUrl,
      },
      { new: true },
    );
    return article;
  }

  async deleteArticle(articleId) {
    await Article.deleteOne({ _id: articleId });
    await Reaction.deleteMany({ to: articleId });
    await Comment.deleteMany({ article: articleId });
    return articleId;
  }
}

module.exports = new ArticleService();
