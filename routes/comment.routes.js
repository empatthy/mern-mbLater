const { Router } = require('express');
const commentController = require('../controllers/comment-controller');

const router = Router();

router.post('/addComment', commentController.addComment);
router.patch('/:commentId', commentController.patchComment);
router.delete('/:commentId', commentController.deleteComment);

router.get('/count/:articleId', commentController.getArticleCommentsCount);

router.post('/replyComment', commentController.replyComment);
router.get('/getArticleComments/:articleId', commentController.getArticleComments);
router.get('/getCommentReplies', commentController.getCommentReplies);

module.exports = router;
