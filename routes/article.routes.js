const { Router } = require('express');

const Article = require('../models/Article');
const articleController = require('../controllers/article-controller');

const router = Router();

router.get('/articles', articleController.getArticles);

router.post('/add', articleController.addArticle);

/* router.post('/add', auth, async (req, res) => {
  try {
    const { title, description, body, author, date } = req.body;

    const article = new Article({
      title,
      description,
      body,
      author,
      date,
    });

    await article.save();

    res.status(201).json('Статья создана');
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
}); */

module.exports = router;
