const { Router } = require('express');
const reactionController = require('../controllers/reaction-controller');

const router = Router();

router.post('/addReaction', reactionController.addReaction);
router.get('/getAllReactions', reactionController.getAllReactions);
router.get('/getArticleReactions/:articleId', reactionController.getArticleReactions);
router.delete('/removeReaction', reactionController.removeReaction);

module.exports = router;
