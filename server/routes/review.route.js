import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js'
import {
    addFilmReview,
    deleteFilmReview,
    getAllFilmReviews,
    getAllMyReviews,
    getFilmReview,
    updateFilmReview
} from '../controllers/review.controller.js';

const reviewRouter = Router();

reviewRouter.get('/reviews', authorize, getAllMyReviews);

reviewRouter.get('/:movieId/review', authorize, getFilmReview);

reviewRouter.post('/:movieId/review', authorize, addFilmReview);

reviewRouter.patch('/:movieId/review', authorize, updateFilmReview);

reviewRouter.delete('/:movieId/review', authorize, deleteFilmReview);

reviewRouter.get('/:movieId/reviews', authorize, getAllFilmReviews);

// reviewRouter.get('/users/:userId/reviews', authorize, getAllFilmReviews);

export default reviewRouter;