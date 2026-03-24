import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js'
import {
    addFilmReview,
    deleteFilmReview,
    getAllFilmReviews,
    getAllUserReviews,
    getFilmReview,
    updateFilmReview,
    likeReview
} from '../controllers/review.controller.js';

const reviewRouter = Router();

reviewRouter.get('/reviews', authorize, getAllUserReviews);

reviewRouter.get('/users/:userId/reviews', authorize, getAllUserReviews);

reviewRouter.get('/:movieId/review', authorize, getFilmReview);

reviewRouter.post('/:movieId/review', authorize, addFilmReview);

reviewRouter.patch('/:movieId/review', authorize, updateFilmReview);

reviewRouter.patch('/reviews/:reviewId', authorize, likeReview);

reviewRouter.delete('/:movieId/review', authorize, deleteFilmReview);

reviewRouter.get('/:movieId/reviews', authorize, getAllFilmReviews);

// reviewRouter.get('/users/:userId/reviews', authorize, getAllFilmReviews);

export default reviewRouter;