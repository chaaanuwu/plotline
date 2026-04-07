import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getTopRatedMovies, getTrendingMovies } from '../controllers/tmdb.controller.js';

const tmdbRouter = Router();

tmdbRouter.get('/trending', authorize, getTrendingMovies);

tmdbRouter.get('/top-rated', authorize, getTopRatedMovies);

export default tmdbRouter;