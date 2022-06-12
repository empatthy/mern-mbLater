const { Router } = require('express');
const commentController = require('../controllers/comment-controller');

const router = Router();

router.post('/addComment', commentController.addComment);
router.post('/replyComment', commentController.replyComment);
router.get('/getArticleComments/:articleId', commentController.getArticleComments);
router.get('/getCommentReplies', commentController.getCommentReplies);

module.exports = router;
