const { Router } = require('express');

const Article = require('../models/Article');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.get('/get', async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name');
    res.json(articles);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

router.post('/add', auth, async (req, res) => {
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
});

module.exports = router;
