import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js';

import { addReplyComment, addReviewComment, getAllComments, updateReplyComment, deleteReplyComment, getComment } from '../controllers/comment.controller.js';

const commentRouter = Router();

commentRouter.get('/:reviewId/comments', authorize, getAllComments);

commentRouter.get('/:reviewId/comments/:commentId', authorize, getComment);

commentRouter.post('/:reviewId/comments', authorize, addReviewComment);

commentRouter.post('/:reviewId/comments/:commentId/reply', authorize, addReplyComment);

commentRouter.patch('/:reviewId/comments/:commentId/reply/:replyCommentId', authorize, updateReplyComment);

commentRouter.delete('/:reviewId/comments/:commentId/reply/:replyCommentId', authorize, deleteReplyComment);

export default commentRouter;