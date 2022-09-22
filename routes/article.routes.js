const { Router } = require('express');
const articleController = require('../controllers/article-controller');

const router = Router();

router.get('/articles', articleController.getArticles);
router.get('/:articleId', articleController.getArticle);
router.get('/userArticles/:userId', articleController.getUserArticles);
router.post('/add', articleController.addArticle);
router.patch('/:articleId', articleController.patchArticle);
router.delete('/delete/:articleId', articleController.deleteArticle);

module.exports = router;
